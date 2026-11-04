import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

interface Plan {
	id: string;
	name: string;
	description: string | null;
	price: number;
	monthlyMinutesLimit: number;
	allowVideoUpload: boolean;
	audioRetentionDays: number;
	videoRetentionDays: number;
	maxSummaryAttemptsPerMedia: number;
}

export const usePlans = () => {
	return useQuery<Plan[]>({
		queryKey: ["plans"],
		queryFn: async () => {
			const response = await api.get("/plans");

			return response.data.plans;
		},
		staleTime: Infinity,
	});
};
