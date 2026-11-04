import { cn } from "@/lib/utils";
import type { MediaStatus } from "@/types/media";

interface StatusBadgeProps {
	status: MediaStatus;
}

const statusConfig: Record<MediaStatus, { label: string; className: string }> =
	{
		pending_transcription: {
			label: "Aguardando transcrição",
			className: "bg-stone-500/10 text-stone-400 border-stone-500/20",
		},
		processing_transcription: {
			label: "Transcrevendo...",
			className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
		},
		failed_transcription: {
			label: "Erro ao transcrever",
			className: "bg-red-500/10 text-red-400 border-red-500/20",
		},
		transcribed: {
			label: "Transcrição concluída",
			className: "bg-green-500/10 text-green-400 border-green-500/20",
		},
		pending_summary: {
			label: "Aguardando resumo",
			className: "bg-stone-500/10 text-stone-400 border-stone-500/20",
		},
		processing_summary: {
			label: "Resumindo...",
			className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
		},
		failed_summary: {
			label: "Erro ao gerar resumo",
			className: "bg-red-500/10 text-red-400 border-red-500/20",
		},
		summarized: {
			label: "Resumo gerado",
			className: "bg-green-500/10 text-green-400 border-green-500/20",
		},
	};

export function StatusBadge({ status }: StatusBadgeProps) {
	const config = statusConfig[status];

	return (
		<span
			className={cn(
				"inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border",
				config.className,
			)}
		>
			{config.label}
		</span>
	);
}
