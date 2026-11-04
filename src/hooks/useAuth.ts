import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, tokenStorage } from "@/lib/api";
import type { LoginFormData, RegisterFormData } from "@/schemas/auth.schema";

export interface AuthResponse {
	token: string;
}

export type Provider = "google" | "github";

export interface UserPlan {
	id: string;
	name: string;
	price: number;
	description: string;
	monthlyMinutesLimit: number;
	allowVideoUpload: boolean;
	audioRetentionDays: number;
	videoRetentionDays: number;
	maxSummaryAttemptsPerMedia: number;
}

export interface UserProfile {
	id: string;
	name: string;
	email: string;
	plan: UserPlan;
	minutesUsed: number;
	minutesRemaining: number;
	cycleEnd: string;
}

export const profileQueryKey = ["profile"] as const;

export function useLogin() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: LoginFormData): Promise<AuthResponse> => {
			const response = await api.post<AuthResponse>("/authenticate", data);
			return response.data;
		},
		onSuccess: async (data) => {
			tokenStorage.set(data.token);
			await queryClient.invalidateQueries({ queryKey: profileQueryKey });
		},
	});
}

export function useRegister() {
	return useMutation({
		mutationFn: async (data: RegisterFormData): Promise<void> => {
			await api.post("/users", data);
		},
	});
}

export function useSocialLogin() {
	return useMutation({
		mutationFn: async (_provider: Provider): Promise<never> => {
			throw new Error("Login social ainda não está disponível.");
		},
	});
}

export function useLogout() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			tokenStorage.clear();
		},
		onSuccess: () => {
			queryClient.clear();
			window.location.href = "/sign-in";
		},
	});
}

export function useProfile() {
	return useQuery<UserProfile>({
		queryKey: profileQueryKey,
		queryFn: async () => {
			const response = await api.get<{ user: UserProfile }>("/me");
			return response.data.user;
		},
		enabled: !!tokenStorage.get(),
		staleTime: 1000 * 60,
	});
}
