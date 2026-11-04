import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { MediaType } from "@/types/media";

export interface UploadFileResponse {
	url: string;
	key: string;
	filename: string;
	duration?: number;
}

interface CreateMediaPayload {
	filename: string;
	url: string;
	storageKey: string;
	type: MediaType;
	language?: string;
	duration?: number;
	tags: string[];
	prompt?: string;
}

export function useUploadFile() {
	return useMutation({
		mutationFn: async (file: File): Promise<UploadFileResponse> => {
			const formData = new FormData();
			formData.append("file", file);

			const response = await api.post<UploadFileResponse>(
				"/files/upload",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);

			return response.data;
		},
	});
}

export function useCreateMedia() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: CreateMediaPayload) => {
			const response = await api.post<{ mediaId: string }>("/medias", payload);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["medias"] });
			queryClient.invalidateQueries({ queryKey: ["profile"] });
		},
	});
}

/**
 * Upload stores the file and returns its stable `key`. Media creation is a
 * separate request, so the API never creates the media twice.
 */
export function useUploadAndCreateMedia() {
	const uploadFile = useUploadFile();
	const createMedia = useCreateMedia();

	return useMutation({
		mutationFn: async ({
			filename,
			file,
			type,
			language,
			duration,
			tags,
			prompt,
		}: {
			filename: string;
			file: File;
			type: MediaType;
			language?: string;
			tags: string[];
			duration?: number;
			prompt?: string;
		}) => {
			const uploadResult = await uploadFile.mutateAsync(file);

			return createMedia.mutateAsync({
				filename: filename || uploadResult.filename,
				url: uploadResult.url,
				storageKey: uploadResult.key,
				type,
				language,
				duration: uploadResult.duration || duration,
				tags,
				prompt,
			});
		},
	});
}
