import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SegmentQuality } from "@/types/transcription";

interface QualityIndicatorProps {
	quality: SegmentQuality;
	showLabel?: boolean;
}

const qualityConfig = {
	high: {
		color: "bg-emerald-500",
		label: "Alta confiança",
		description: "Transcrição de alta qualidade",
	},
	medium: {
		color: "bg-yellow-500",
		label: "Confiança média",
		description: "Transcrição pode conter pequenas imprecisões",
	},
	low: {
		color: "bg-red-500",
		label: "Baixa confiança",
		description: "Este trecho pode conter imprecisões. Recomenda-se revisão.",
	},
};

export function QualityIndicator({
	quality,
	showLabel = false,
}: QualityIndicatorProps) {
	const config = qualityConfig[quality];

	return (
		<TooltipProvider>
			<Tooltip delayDuration={200}>
				<TooltipTrigger asChild>
					<div className="flex items-center gap-2">
						<div className={`w-2 h-2 rounded-full ${config.color}`} />
						{showLabel && (
							<span className="text-xs text-muted-foreground">
								{config.label}
							</span>
						)}
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p className="text-sm font-medium">{config.label}</p>
					<p className="text-xs text-muted-foreground">{config.description}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
