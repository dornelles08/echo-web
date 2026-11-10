import * as Sentry from "@sentry/react";
import axios from "axios";

const LOKI_URL = import.meta.env.VITE_LOKI_URL ?? "http://localhost:3100";

let _traceId: string | null = null;

/**
 * Gera ou recupera o traceId da sessão atual no front.
 * É persistido em sessionStorage para sobreviver a refreshs da página
 * dentro da mesma sessão de usuário.
 */
export function getOrCreateTraceId(): string {
	if (_traceId) {
		return _traceId;
	}

	const stored = sessionStorage.getItem("echo_trace_id");
	if (stored) {
		_traceId = stored;
		return _traceId;
	}

	const generated = crypto.randomUUID();
	_traceId = generated;
	sessionStorage.setItem("echo_trace_id", generated);
	return generated;
}

/**
 * Envia um log estruturado para o Loki via HTTP.
 * Se o Loki não estiver disponível, o erro é ignorado silenciosamente
 * para não quebrar a experiência do usuário.
 */
export async function sendLogToLoki(
	payload: Record<string, unknown>,
): Promise<void> {
	try {
		await axios.post(`${LOKI_URL}/loki/api/v1/push`, {
			streams: [
				{
					stream: {
						service: "echo-web",
						env: import.meta.env.MODE ?? "development",
						level: String(payload.level ?? "info"),
					},
					values: [[Date.now().toString(), JSON.stringify(payload)]],
				},
			],
		});
	} catch {
		// Ignora falhas de envio de log para não impactar o usuário
	}
}

/**
 * Log de erro do front. Envia para o Sentry (se configurado) e para o Loki.
 */
export async function logError(
	error: unknown,
	context?: Record<string, unknown>,
) {
	const traceId = getOrCreateTraceId();

	Sentry.captureException(error, {
		extra: { ...context, traceId },
	});

	await sendLogToLoki({
		level: "error",
		traceId,
		message: error instanceof Error ? error.message : String(error),
		stack: error instanceof Error ? error.stack : undefined,
		...context,
	});
}

/**
 * Log de evento de negócio do front (ex: upload iniciado, transcrição solicitada).
 */
export async function logEvent(
	event: string,
	context?: Record<string, unknown>,
) {
	const traceId = getOrCreateTraceId();

	await sendLogToLoki({
		level: "info",
		traceId,
		event,
		...context,
	});
}
