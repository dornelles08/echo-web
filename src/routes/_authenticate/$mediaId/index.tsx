import {
	createFileRoute,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import { Clock, Globe, Tag } from "lucide-react";
import { useState } from "react";

import { StatusBadge } from "@/components/StatusBadge";
import { COMMON_LANGUAGES } from "@/config/constantes";
import { useGenerateSummary } from "@/hooks/useGenerateSummary";
import { useMedia } from "@/hooks/useMedia";
import { useUserLimits } from "@/hooks/useUserLimits";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDuration } from "@/lib/duration";
import { SummaryPanel } from "./-components/SummaryPanel";
import { TranscriptionList } from "./-components/TranscriptionList";

export const Route = createFileRoute("/_authenticate/$mediaId/")({
	component: MediaDetailsPage,
});

function MediaDetailsPage() {
	const { mediaId } = useParams({ from: "/_authenticate/$mediaId/" });
	const navigate = useNavigate();
	const { data, isError, isLoading, error: mediaError } = useMedia(mediaId);
	const generateSummaryMutation = useGenerateSummary(mediaId);
	const { canGenerateSummary } = useUserLimits();
	const [summaryError, setSummaryError] = useState<string | null>(null);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="flex flex-col items-center gap-4">
					<div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
					<p className="text-muted-foreground">Carregando...</p>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex items-center justify-center h-full">
				<p className="text-destructive">
					{getApiErrorMessage(mediaError, "Erro ao carregar mídia.")}
				</p>
			</div>
		);
	}

	const media = data?.media;

	if (!media) {
		return (
			<div className="flex items-center justify-center h-full">
				<p className="text-muted-foreground">Erro ao carregar mídia</p>
			</div>
		);
	}

	const languague = COMMON_LANGUAGES.find(
		({ code }) => code === media.language,
	);

	const summaryAttempts =
		(media as { summaryAttempts?: number }).summaryAttempts ?? 0;
	const { canGenerate: canGenerateSummaryResult, reason: limitReason } =
		canGenerateSummary(summaryAttempts);

	const handleGenerateSummary = async (prompt: string) => {
		setSummaryError(null);
		try {
			await generateSummaryMutation.mutateAsync({ prompt });
		} catch (error) {
			console.error("Erro ao gerar resumo:", error);
			setSummaryError(getApiErrorMessage(error, "Erro ao gerar resumo."));
		}
	};

	const handleUpgrade = () => {
		navigate({ to: "/plans", search: { plan: undefined } });
	};

	return (
		<div className="h-full flex flex-col">
			<div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 divide-x divide-border">
				<div className="flex flex-col overflow-hidden">
					<div className="px-4 lg:px-6 py-2 lg:py-4 border-b border-border shrink-0">
						<div className="flex items-start justify-between mb-4">
							<div className="flex-1">
								<h1 className="text-2xl font-bold mb-2">{media.filename}</h1>
								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<div className="flex items-center gap-1.5">
										<Clock className="w-4 h-4" />
										{formatDuration(media.duration)}
									</div>
									<div className="flex items-center gap-1.5">
										<Globe className="w-4 h-4" />
										{languague?.name || media.language}
									</div>
								</div>
							</div>
							<StatusBadge status={media.status} />
						</div>

						<div className="flex items-center gap-2">
							<Tag className="w-4 h-4 text-muted-foreground" />
							<div className="flex flex-wrap gap-2">
								{media.tags.map((tag) => (
									<span
										key={tag}
										className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-full"
									>
										{tag}
									</span>
								))}
							</div>
						</div>
					</div>

					<div className="flex-1 overflow-hidden">
						<TranscriptionList
							segments={media.segments || []}
							transcription={media.transcription}
						/>
					</div>
				</div>

				<div className="flex flex-col overflow-hidden">
					<SummaryPanel
						summary={media.summary}
						summaryAttempts={summaryAttempts}
						canGenerateSummary={canGenerateSummaryResult}
						limitReason={limitReason}
						onGenerate={handleGenerateSummary}
						onUpgrade={handleUpgrade}
						isGenerating={generateSummaryMutation.isPending}
						errorMessage={summaryError}
					/>
				</div>
			</div>
		</div>
	);
}
