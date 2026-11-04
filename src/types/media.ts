export type MediaType = "video" | "audio";

export type MediaStatus =
	| "pending_transcription"
	| "processing_transcription"
	| "failed_transcription"
	| "transcribed"
	| "pending_summary"
	| "processing_summary"
	| "failed_summary"
	| "summarized";

export interface Segment {
	id: string;
	start: number;
	end: number;
	text: string;
	avg_logprob: number;
	compression_ratio: number;
	no_speech_prob: number;
}

export interface Media {
	id: string;
	filename: string;
	url: string;
	storageKey?: string;
	type?: MediaType;
	prompt?: string;
	language: string;
	transcription?: string;
	duration: number;
	summary: string[];
	summaryPrompt?: string;
	summaryAttempts: number;
	status: MediaStatus;
	tags: string[];
	segments: Segment[];
	createdAt?: string;
	updatedAt?: string;
}

export interface PaginationInfo {
	page: number;
	perPage: number;
	total: number;
	totalPages: number;
}

export interface MediasResponse {
	medias: Media[];
	pagination: PaginationInfo;
}
