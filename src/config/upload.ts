// Configurações de upload de arquivos

export const UPLOAD_CONFIG = {
	// Tamanho máximo em bytes (500MB padrão)
	maxFileSize: 500 * 1024 * 1024, // 500MB

	// Formatos aceitos
	acceptedFormats: {
		video: [".mp4", ".mov", ".avi", ".mkv", ".webm"],
		audio: [".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac", ".webm"],
	},

	// MIME types aceitos
	acceptedMimeTypes: {
		video: [
			"video/mp4",
			"video/quicktime",
			"video/x-msvideo",
			"video/x-matroska",
			"video/webm",
		],
		audio: [
			"audio/mp3",
			"audio/wav",
			"audio/m4a",
			"audio/aac",
			"audio/ogg",
			"audio/flac",
			"audio/x-m4a",
			"audio/webm",
		],
	},
};

// Helper para formatar tamanho de arquivo
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${Math.round((bytes / k ** i) * 100) / 100} ${sizes[i]}`;
}

// Helper para validar tipo de arquivo
export function validateFileType(file: File): "video" | "audio" | null {
	const videoFormats = UPLOAD_CONFIG.acceptedMimeTypes.video;
	const audioFormats = UPLOAD_CONFIG.acceptedMimeTypes.audio;

	if (videoFormats.includes(file.type)) return "video";
	if (audioFormats.includes(file.type)) return "audio";

	return null;
}

// Helper para obter extensões aceitas como string
export function getAcceptedExtensions(includeVideo: boolean = true): string {
	if (includeVideo) {
		return [
			...UPLOAD_CONFIG.acceptedFormats.video,
			...UPLOAD_CONFIG.acceptedFormats.audio,
		].join(",");
	}
	return UPLOAD_CONFIG.acceptedFormats.audio.join(",");
}
