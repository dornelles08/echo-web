import axios, { type AxiosError } from "axios";

import { getApiErrorMessage } from "./api-error";
import { getOrCreateTraceId, logError, logEvent } from "./logger";

export * from "./api-error";

export const API_URL = (() => {
	const envUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

	// Se VITE_API_URL foi definido explicitamente, use-o.
	// Obrigatório em produção quando front e back estão em domínios distintos.
	if (import.meta.env.VITE_API_URL) {
		return envUrl.replace(/\/$/, "");
	}

	// Somente em desenvolvimento permite inferir a API da origem da página.
	// Útil para túneis ngrok sem precisar mudar a URL a cada túnel.
	// Em produção não infere dinamicamente por segurança.
	if (import.meta.env.DEV && typeof window !== "undefined") {
		try {
			const parsed = new URL(envUrl);
			const isLocalhost =
				parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
			const clientIsRemote =
				window.location.hostname !== "localhost" &&
				window.location.hostname !== "127.0.0.1";

			if (isLocalhost && clientIsRemote) {
				return window.location.origin.replace(/\/$/, "");
			}
		} catch {
			// ignore malformed env URL and fall back to the default
		}
	}

	return envUrl;
})();

export const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// --- Request interceptor: injeta X-Trace-ID em toda chamada à API ---
api.interceptors.request.use((config) => {
	const traceId = getOrCreateTraceId();
	config.headers["X-Trace-ID"] = traceId;
	return config;
});

// --- Response interceptor: captura traceId da resposta e loga erros ---
api.interceptors.response.use(
	(response) => {
		const traceId = response.headers["x-trace-id"] as string | undefined;
		if (traceId) {
			sessionStorage.setItem("echo_trace_id", traceId);
		}
		return response;
	},
	async (error: AxiosError) => {
		const apiMessage = getApiErrorMessage(error);
		if (apiMessage && error.message !== apiMessage) {
			error.message = apiMessage;
		}

		// Log de erro de API no Loki/Sentry com contexto da requisição
		if (error.config) {
			await logError(error, {
				url: error.config.url,
				method: error.config.method,
				status: error.response?.status,
			});
		} else {
			await logError(error);
		}

		return Promise.reject(error);
	},
);
