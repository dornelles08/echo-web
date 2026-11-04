import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { Media, PaginationInfo } from "@/types/media";

interface GetTagsResponse {
	tags: string[];
}

interface GetMediasParams {
	page?: number;
	perPage?: number;
	tags?: string[];
	type?: string;
	status?: string;
}

interface GetMediasResponse {
	medias: Media[];
	pagination: PaginationInfo;
}

export function useMedias(params: GetMediasParams = {}) {
	return useQuery({
		queryKey: ["medias", params],
		queryFn: async (): Promise<GetMediasResponse> => {
			const response = await api.get("/medias", {
				params: {
					...params,
					tags: params.tags?.join(","),
				},
			});
			return response.data;
		},
		staleTime: 1000 * 60, // 1 minuto
	});
}

export function useMedia(id: string) {
	return useQuery({
		queryKey: ["media", id],
		queryFn: async (): Promise<{ media: Media } | null> => {
			const response = await api.get(`/medias/${id}`);

			return response.data;
		},
		enabled: !!id,
	});
}

export function useTags() {
	return useQuery({
		queryKey: ["tags"],
		queryFn: async (): Promise<string[]> => {
			const response = await api.get<GetTagsResponse>("/tags");
			return response.data.tags;
		},
		staleTime: 1000 * 60 * 10, // 10 minutos - tags mudam com menos frequência
	});
}
