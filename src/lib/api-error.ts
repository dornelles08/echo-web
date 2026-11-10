import axios, { type AxiosError } from "axios";

/**
 * Shape of the structured error body returned by @echo-api/.
 *
 *   { statusCode, error, message, details? }
 *
 * `error` is a stable machine-readable code (ex.: `ENTITY_NOT_FOUND`).
 * `message` is a human-readable description (may be in English on the API side).
 * `details` carries extra context, such as per-field Zod validation issues.
 */
export interface ApiErrorBody {
	statusCode?: number;
	error?: string;
	message?: string;
	details?: unknown;
}

export interface ApiErrorInfo {
	status: number | null;
	code: string | null;
	message: string;
	details: unknown;
}

/**
 * Friendly, user-facing (Portuguese) messages for the stable error codes
 * exposed by @echo-api/. Unknown codes fall back to the API message or a
 * generic message.
 */
export const API_ERROR_MESSAGES: Record<string, string> = {
	INVALID_CREDENTIALS: "E-mail ou senha incorretos. Tente novamente.",
	EMAIL_ALREADY_EXISTS: "Este e-mail já está cadastrado.",
	ENTITY_NOT_FOUND: "O recurso solicitado não foi encontrado.",
	PLAN_LIMIT_EXCEEDED: "Você atingiu o limite de minutos do seu plano.",
	VIDEO_NOT_ALLOWED: "Seu plano atual não permite upload de vídeos.",
	SUMMARY_ATTEMPTS_EXCEEDED:
		"Você atingiu o limite de tentativas de resumo para esta mídia.",
	TRANSCRIPTION_ATTEMPTS_EXCEEDED:
		"Não foi possível transcrever este áudio após 3 tentativas. Entre em contato com o suporte para investigar o problema.",
	INVALID_STATUS: "A operação não pode ser realizada no estado atual.",
	VALIDATION_ERROR: "Os dados enviados são inválidos.",
	INTERNAL_SERVER_ERROR:
		"Ocorreu um erro interno. Tente novamente em instantes.",
};

const DEFAULT_FALLBACK = "Ocorreu um erro inesperado. Tente novamente.";

/**
 * Extracts the structured error body from any thrown value, whether it is an
 * AxiosError, a fetch Response-like object, or an already-parsed body.
 */
export function getApiErrorBody(error: unknown): ApiErrorBody | null {
	if (axios.isAxiosError(error)) {
		const data = (error as AxiosError).response?.data;
		if (data && typeof data === "object") {
			return data as ApiErrorBody;
		}
		return null;
	}

	if (error && typeof error === "object") {
		const candidate = error as Record<string, unknown>;
		if (
			"statusCode" in candidate ||
			"error" in candidate ||
			"message" in candidate ||
			"details" in candidate
		) {
			// Heuristic: treat as a body only if it looks like one.
			if (
				typeof candidate.statusCode === "number" ||
				typeof candidate.error === "string" ||
				typeof candidate.message === "string"
			) {
				return candidate as ApiErrorBody;
			}
		}

		// Support objects exposing a `response.data` shape (fetch wrappers).
		const response = candidate.response as { data?: unknown } | undefined;
		if (response?.data && typeof response.data === "object") {
			return response.data as ApiErrorBody;
		}
	}

	return null;
}

/**
 * Normalizes a thrown value into a structured {@link ApiErrorInfo}.
 */
export function getApiError(
	error: unknown,
	fallback = DEFAULT_FALLBACK,
): ApiErrorInfo {
	const body = getApiErrorBody(error);
	const status =
		typeof body?.statusCode === "number"
			? body.statusCode
			: axios.isAxiosError(error)
				? (error.response?.status ?? null)
				: null;
	const code = typeof body?.error === "string" ? body.error : null;

	let message = DEFAULT_FALLBACK;
	if (code && API_ERROR_MESSAGES[code]) {
		message = API_ERROR_MESSAGES[code];
	} else if (typeof body?.message === "string" && body.message.trim()) {
		message = body.message;
	} else if (error instanceof Error && error.message.trim()) {
		message = error.message;
	} else if (fallback) {
		message = fallback;
	}

	// Prefer the first validation issue message when available.
	if (Array.isArray(body?.details) && body.details.length > 0) {
		const first = body.details[0] as { message?: unknown } | string;
		const detailMessage =
			typeof first === "string"
				? first
				: typeof first?.message === "string"
					? first.message
					: null;
		if (detailMessage && code === "VALIDATION_ERROR") {
			message = detailMessage;
		}
	}

	if (!message) message = fallback || DEFAULT_FALLBACK;

	return {
		status,
		code,
		message,
		details: body?.details ?? null,
	};
}

/**
 * Convenience helper returning only the user-facing message string.
 */
export function getApiErrorMessage(error: unknown, fallback?: string): string {
	return getApiError(error, fallback).message;
}

/**
 * Error subclass carrying the structured API error information. Useful to
 * rethrow a normalized error while keeping the original response accessible.
 */
export class ApiError extends Error {
	status: number | null;
	code: string | null;
	details: unknown;

	constructor(error: unknown, fallback?: string) {
		const info = getApiError(error, fallback);
		super(info.message);
		this.name = "ApiError";
		this.status = info.status;
		this.code = info.code;
		this.details = info.details;
	}
}
