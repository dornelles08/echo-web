import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { LoginFormData, RegisterFormData } from "@/schemas/auth.schema";

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
		mutationFn: async (data: LoginFormData) => {
			const result = await authClient.signIn.email({
				email: data.email,
				password: data.password,
			});

			if (result.error) {
				throw new Error(result.error.message ?? "Falha ao entrar.");
			}

			return result.data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: profileQueryKey });
		},
	});
}

export function useRegister() {
	return useMutation({
		mutationFn: async (data: RegisterFormData) => {
			const result = await authClient.signUp.email({
				name: data.name,
				email: data.email,
				password: data.password,
			});

			if (result.error) {
				throw new Error(result.error.message ?? "Falha ao criar conta.");
			}

			return result.data;
		},
	});
}

export function useSocialLogin() {
	return useMutation({
		mutationFn: async (provider: "google" | "github") => {
			const result = await authClient.signIn.social({
				provider,
				callbackURL: `${window.location.origin}/sign-in`,
			});

			if (result.error) {
				throw new Error(
					result.error.message ?? "Falha ao entrar com rede social.",
				);
			}

			return result.data;
		},
	});
}

export function useLogout() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			await authClient.signOut();
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
		staleTime: 1000 * 60,
	});
}

export function useAvailableSocialProviders() {
	return useQuery<Provider[]>({
		queryKey: ["socialProviders"],
		queryFn: async () => {
			const response = await api.get<{ providers: string[] }>(
				"/auth/providers",
			);
			return response.data.providers as Provider[];
		},
		staleTime: 1000 * 60 * 10,
	});
}
