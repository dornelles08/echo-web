import { Check, Copy, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Segment } from "@/types/media";
import { isSignificantPause } from "@/types/transcription";
import { PauseMarker } from "./PauseMarker";
import { TranscriptionSegmentItem } from "./TranscriptionSegmentItem";

interface TranscriptionListProps {
	segments: Segment[];
	transcription?: string;
	onSeek?: (time: number) => void;
}

export function TranscriptionList({
	segments,
	transcription,
	onSeek,
}: TranscriptionListProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [copied, setCopied] = useState(false);

	const filteredSegments = segments.filter((segment) =>
		segment.text.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const fullText =
		transcription?.trim() ||
		segments
			.map((segment) => segment.text)
			.join(" ")
			.trim();

	const handleCopy = async () => {
		if (!fullText) return;
		try {
			await navigator.clipboard.writeText(fullText);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Erro ao copiar transcrição:", error);
		}
	};

	return (
		<div className="flex flex-col h-full">
			<div className="p-4 border-b border-border shrink-0 space-y-3">
				<div className="flex items-center justify-between gap-2">
					<span className="text-sm font-medium text-muted-foreground">
						Transcrição
					</span>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleCopy}
						disabled={!fullText}
						className="gap-2"
					>
						{copied ? (
							<>
								<Check className="w-4 h-4" />
								Copiado!
							</>
						) : (
							<>
								<Copy className="w-4 h-4" />
								Copiar transcrição
							</>
						)}
					</Button>
				</div>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Pesquisar na transcrição..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 rounded-xl"
					/>
				</div>
				{searchQuery && (
					<p className="text-xs text-muted-foreground mt-2">
						{filteredSegments.length} resultado
						{filteredSegments.length !== 1 ? "s" : ""} encontrado
						{filteredSegments.length !== 1 ? "s" : ""}
					</p>
				)}
			</div>

			<div className="flex-1 overflow-y-auto">
				{filteredSegments.length === 0 ? (
					<div className="flex items-center justify-center h-full">
						<p className="text-sm text-muted-foreground">
							{searchQuery
								? "Nenhum resultado encontrado"
								: "Nenhum segmento disponível"}
						</p>
					</div>
				) : (
					<div className="py-2">
						{filteredSegments.map((segment, index) => {
							const nextSegment = filteredSegments[index + 1];
							const showPause =
								nextSegment && isSignificantPause(segment.no_speech_prob);

							return (
								<div key={segment.id}>
									<TranscriptionSegmentItem segment={segment} onSeek={onSeek} />
									{showPause && <PauseMarker />}
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
