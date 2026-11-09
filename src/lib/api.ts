import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { getApiErrorMessage } from "./api-error";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

const TOKEN_STORAGE_KEY = "auth_token";

export const tokenStorage = {
	get: () => localStorage.getItem(TOKEN_STORAGE_KEY),
	set: (token: string) => localStorage.setItem(TOKEN_STORAGE_KEY, token),
	clear: () => localStorage.removeItem(TOKEN_STORAGE_KEY),
};

export * from "./api-error";

export const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	const token = tokenStorage.get();

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

// Rotas em que um 401 significa credencial inválida, não token expirado.
// `/refresh-token` entra na lista para evitar recursão do próprio refresh.
const AUTH_ROUTES = ["/authenticate", "/refresh-token"];

type RetriableRequestConfig = InternalAxiosRequestConfig & {
	_retry?: boolean;
};

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
	const response = await api.post<{ token: string }>("/refresh-token");
	const token = response.data.token;

	tokenStorage.set(token);

	return token;
}

function redirectToSignIn() {
	tokenStorage.clear();
	localStorage.removeItem("user");

	if (window.location.pathname !== "/sign-in") {
		window.location.href = "/sign-in";
	}
}

api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		// Adapt to the new structured error format of @echo-api/:
		// { statusCode, error, message, details? }. Surface the API message (or a
		// friendly mapping of its code) instead of Axios' generic one.
		const apiMessage = getApiErrorMessage(error);
		if (apiMessage && error.message !== apiMessage) {
			error.message = apiMessage;
		}

		const status = error.response?.status;
		const originalRequest = error.config as RetriableRequestConfig | undefined;

		if (status !== 401 || !originalRequest) {
			return Promise.reject(error);
		}

		const isAuthRoute = AUTH_ROUTES.some((route) =>
			originalRequest.url?.includes(route),
		);

		if (isAuthRoute || originalRequest._retry) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;

		try {
			refreshPromise ??= refreshAccessToken().finally(() => {
				refreshPromise = null;
			});

			const token = await refreshPromise;

			originalRequest.headers.Authorization = `Bearer ${token}`;

			return api(originalRequest);
		} catch (refreshError) {
			redirectToSignIn();
			return Promise.reject(refreshError);
		}
	},
);
