import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    staleTime: 1000 * 20, // 20 segundos
  });
}

const PROCESSING_STATUSES = [
  "pending_transcription",
  "processing_transcription",
  "pending_summary",
  "processing_summary",
] as const;

export function useMedia(id: string) {
  return useQuery({
    queryKey: ["media", id],
    queryFn: async (): Promise<{ media: Media } | null> => {
      const response = await api.get(`/medias/${id}`);

      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 10, // 10 segundos
    refetchInterval: (query) => {
      const media = query.state.data?.media;
      if (
        media &&
        PROCESSING_STATUSES.includes(media.status as (typeof PROCESSING_STATUSES)[number])
      ) {
        return 1000 * 10; // 10 segundos enquanto processando
      }
      return false;
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mediaId: string): Promise<void> => {
      await api.delete(`/medias/${mediaId}`);
    },
    onSuccess: (_, mediaId) => {
      queryClient.invalidateQueries({ queryKey: ["medias"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.removeQueries({ queryKey: ["media", mediaId] });
    },
  });
}

export function useRetryTranscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mediaId: string): Promise<void> => {
      await api.post(`/medias/${mediaId}/retry-transcription`);
    },
    onSuccess: (_, mediaId) => {
      queryClient.invalidateQueries({ queryKey: ["medias"] });
      queryClient.invalidateQueries({ queryKey: ["media", mediaId] });
    },
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
