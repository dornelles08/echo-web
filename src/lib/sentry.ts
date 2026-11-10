import * as Sentry from "@sentry/react";

import { getOrCreateTraceId } from "./logger";

export function initSentry() {
	const dsn = import.meta.env.VITE_SENTRY_DSN;

	if (!dsn) {
		return;
	}

	Sentry.init({
		dsn,
		environment: import.meta.env.MODE ?? "development",
		release: import.meta.env.VITE_APP_VERSION,
		tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
		beforeSend(event) {
			// Não enviar dados sensíveis do usuário (senhas, tokens) para o Sentry
			if (event.request && event.request.data) {
				const data = event.request.data as Record<string, unknown>;
				if (data.password) {
					data.password = "[REDACTED]";
				}
				if (data.token) {
					data.token = "[REDACTED]";
				}
			}
			return event;
		},
	});
}
