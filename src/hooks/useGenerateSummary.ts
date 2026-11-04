import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

interface GenerateSummaryPayload {
	prompt?: string;
}

export function useGenerateSummary(mediaId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: GenerateSummaryPayload) => {
			const response = await api.post(`/medias/${mediaId}/summary`, payload);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["medias", mediaId] });
			queryClient.invalidateQueries({ queryKey: ["profile"] });
		},
	});
}
