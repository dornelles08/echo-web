import { useState } from "react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Segment } from "@/types/media";
import {
	formatTimestamp,
	getSegmentDuration,
	getSegmentQuality,
} from "@/types/transcription";
import { QualityIndicator } from "./QualityIndicator";

interface TranscriptionSegmentItemProps {
	segment: Segment;
	onSeek?: (time: number) => void;
}

export function TranscriptionSegmentItem({
	segment,
	onSeek: _onSeek,
}: TranscriptionSegmentItemProps) {
	const [isHovered, setIsHovered] = useState(false);
	const quality = getSegmentQuality(segment.avg_logprob);
	const duration = getSegmentDuration(segment.start, segment.end);

	return (
		<div
			className="group py-3 px-4 hover:bg-secondary/50 rounded-lg transition-colors cursor-pointer"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			aria-hidden="true"
		>
			<div className="flex items-start gap-3">
				<div className="shrink-0 mt-1">
					<QualityIndicator quality={quality} />
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<button
										className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
										type="button"
									>
										{formatTimestamp(segment.start)}
									</button>
								</TooltipTrigger>
							</Tooltip>
						</TooltipProvider>

						{isHovered && (
							<span className="text-xs text-muted-foreground">
								• {duration}
							</span>
						)}
					</div>

					<TooltipProvider>
						<Tooltip delayDuration={500}>
							<TooltipTrigger asChild>
								<p className="text-sm leading-relaxed">{segment.text}</p>
							</TooltipTrigger>
							<TooltipContent className="max-w-sm">
								<div className="space-y-2">
									<div>
										<p className="text-xs font-semibold mb-1">
											Informações do segmento
										</p>
									</div>
									<div className="space-y-1">
										<p className="text-xs">
											<span className="text-muted-foreground">Duração:</span>{" "}
											<span className="font-medium">{duration}</span>
										</p>
										<p className="text-xs">
											<span className="text-muted-foreground">Confiança:</span>{" "}
											<span className="font-medium">
												{quality === "high" && "Alta"}
												{quality === "medium" && "Média"}
												{quality === "low" && "Baixa"}
											</span>
										</p>
										{quality === "low" && (
											<p className="text-xs text-yellow-600 dark:text-yellow-400">
												Este trecho pode conter imprecisões
											</p>
										)}
									</div>
								</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>
		</div>
	);
}
