export interface TranscriptionSegment {
	id: number;
	start: number; // timestamp em segundos
	end: number;
	text: string;
	temperature: number;
	avg_logprob: number; // indicador de confiança
	compression_ratio: number;
	no_speech_prob: number; // probabilidade de silêncio
}

export interface MediaDetails {
	id: string;
	filename: string;
	url: string;
	type: "video" | "audio";
	status:
		| "pending_transcription"
		| "transcribing"
		| "processing"
		| "completed"
		| "error";
	duration: string;
	tags: string[];
	prompt?: string;
	transcription?: string; // transcrição corrida para gerar resumo
	segments?: TranscriptionSegment[]; // segmentos detalhados para exibição
	summary?: string[]; // resumos gerados (array de versões)
	createdAt: string;
	updatedAt: string;
}

// Helper para calcular qualidade do segmento
export type SegmentQuality = "high" | "medium" | "low";

export function getSegmentQuality(avg_logprob: number): SegmentQuality {
	// avg_logprob é negativo, quanto mais próximo de 0, melhor
	if (avg_logprob > -0.3) return "high";
	if (avg_logprob > -0.6) return "medium";
	return "low";
}

// Helper para verificar se é uma pausa relevante
export function isSignificantPause(no_speech_prob: number): boolean {
	return no_speech_prob > 0.6;
}

// Helper para formatar timestamp
export function formatTimestamp(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Helper para calcular duração do segmento
export function getSegmentDuration(start: number, end: number): string {
	const duration = end - start;
	return `${duration.toFixed(1)}s`;
}
