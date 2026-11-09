import axios, { type AxiosError } from "axios";

import { getApiErrorMessage } from "./api-error";

export * from "./api-error";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

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
