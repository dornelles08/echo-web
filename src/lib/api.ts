import axios, { type AxiosError } from "axios";

import { getApiErrorMessage } from "./api-error";

export * from "./api-error";

export const API_URL = (() => {
	const envUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

	// When the app is opened from another machine on the LAN (e.g.
	// http://192.168.x.x:3000), the configured API URL (localhost:3333)
	// would point at the client's own machine. Rewrite it to the same host
	// the page was loaded from so requests reach the server.
	if (typeof window !== "undefined") {
		try {
			const parsed = new URL(envUrl);
			const isLocalhost =
				parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
			const clientIsRemote =
				window.location.hostname !== "localhost" &&
				window.location.hostname !== "127.0.0.1";

			if (isLocalhost && clientIsRemote) {
				parsed.hostname = window.location.hostname;
				return parsed.toString().replace(/\/$/, "");
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

api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const apiMessage = getApiErrorMessage(error);
		if (apiMessage && error.message !== apiMessage) {
			error.message = apiMessage;
		}

		return Promise.reject(error);
	},
);
