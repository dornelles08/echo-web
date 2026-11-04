import {
	AlertTriangle,
	ArrowLeft,
	Copy,
	Download,
	Plus,
	Sparkles,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSummaryTemplates } from "@/hooks/useSummaryTemplates";

interface SummaryPanelProps {
	summary?: string[];
	summaryAttempts?: number;
	canGenerateSummary: boolean;
	limitReason?: "no_minutes" | "limit_exceeded" | "none";
	onGenerate: (prompt: string) => void;
	onUpgrade?: () => void;
	isGenerating?: boolean;
}

const CUSTOM_PROMPT_VALUE = "custom";

type ViewMode = "summary" | "templates";

export function SummaryPanel({
	summary = [],
	summaryAttempts = 0,
	canGenerateSummary,
	limitReason = "none",
	onGenerate,
	onUpgrade,
	isGenerating,
}: SummaryPanelProps) {
	const { data: templates = [], isLoading } = useSummaryTemplates();
	const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
		templates[0]?.id || null,
	);
	const [customPrompt, setCustomPrompt] = useState("");
	const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
	const [viewMode, setViewMode] = useState<ViewMode>(
		summary.length > 0 ? "summary" : "templates",
	);

	const hasVersions = summary.length > 0;
	const currentSummary =
		selectedVersion !== null ? summary[selectedVersion] : null;

	const isCustomPrompt = selectedTemplateId === CUSTOM_PROMPT_VALUE;

	const handleGenerate = () => {
		if (isCustomPrompt) {
			onGenerate(customPrompt);
		} else {
			const template = templates.find((t) => t.id === selectedTemplateId);
			if (template) {
				onGenerate(template.prompt);
			}
		}
	};

	const handleCopyMarkdown = () => {
		if (currentSummary) {
			navigator.clipboard.writeText(currentSummary);
		}
	};

	const handleDownloadPDF = () => {
		console.log("Download PDF");
	};

	const handleNewVersion = () => {
		setViewMode("templates");
		setSelectedVersion(null);
		setSelectedTemplateId(templates[0]?.id || null);
		setCustomPrompt("");
	};

	const handleSelectVersion = (index: number) => {
		setSelectedVersion(index);
		setViewMode("summary");
	};

	const canGenerate = isCustomPrompt
		? customPrompt.trim().length > 0
		: !!selectedTemplateId;

	const renderTemplatesList = () => (
		<div className="space-y-2">
			<p className="text-sm font-medium mb-2">Escolha um template de resumo</p>

			{templates.map((template) => (
				<button
					key={template.id}
					onClick={() => setSelectedTemplateId(template.id)}
					className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
						selectedTemplateId === template.id
							? "border-emerald-500 bg-emerald-500/10"
							: "border-border hover:border-emerald-500/50 hover:bg-secondary/50"
					}`}
					type="button"
				>
					<p className="font-medium text-sm">{template.label}</p>
					<p className="text-xs text-muted-foreground mt-1">
						{template.description}
					</p>
				</button>
			))}

			<button
				onClick={() => setSelectedTemplateId(CUSTOM_PROMPT_VALUE)}
				className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
					selectedTemplateId === CUSTOM_PROMPT_VALUE
						? "border-emerald-500 bg-emerald-500/10"
						: "border-border hover:border-emerald-500/50 hover:bg-secondary/50"
				}`}
				type="button"
			>
				<p className="font-medium text-sm">Prompt Customizado</p>
				<p className="text-xs text-muted-foreground mt-1">
					Escreva seu próprio prompt para o resumo
				</p>
			</button>
		</div>
	);

	const renderCustomPromptInput = () => (
		<div className="mt-4 space-y-2">
			<p className="text-sm font-medium">Digite seu prompt</p>
			<Textarea
				placeholder="Ex: Crie um resumo focado em decisões tomadas e próximos passos..."
				value={customPrompt}
				onChange={(e) => setCustomPrompt(e.target.value)}
				rows={5}
				className="w-full rounded-xl"
			/>
		</div>
	);

	const renderVersionTabs = () => {
		if (!hasVersions) return null;

		return (
			<div className="flex gap-2 overflow-x-auto pt-4">
				{summary.map((_, index) => (
					<button
						key={`version-${index}`}
						onClick={() => handleSelectVersion(index)}
						className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
							(selectedVersion === null && index === summary.length - 1) ||
							selectedVersion === index
								? "bg-emerald-500 text-white"
								: "bg-secondary text-muted-foreground hover:bg-emerald-500/10"
						}`}
						type="button"
					>
						Versão {index + 1}
					</button>
				))}
				{canGenerateSummary && (
					<button
						onClick={handleNewVersion}
						disabled={isGenerating}
						className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
						type="button"
					>
						<Plus className="w-4 h-4" />
						Nova Versão
					</button>
				)}
			</div>
		);
	};

	return (
		<div className="flex flex-col h-full bg-card">
			<div className="p-6 border-b border-border shrink-0">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 flex items-center justify-center">
						<Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
					</div>
					<h2 className="text-lg font-semibold">Resumo Inteligente</h2>
				</div>

				{hasVersions && viewMode === "summary" && renderVersionTabs()}
			</div>

			<div className="flex-1 overflow-y-auto">
				{viewMode === "templates" && (
					<div className="p-6 space-y-4">
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<p className="text-sm text-muted-foreground">
									Carregando templates...
								</p>
							</div>
						) : (
							<>
								{hasVersions && (
									<button
										type="button"
										onClick={() => {
											setSelectedVersion(summary.length - 1);
											setViewMode("summary");
										}}
										className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors"
									>
										<ArrowLeft className="w-4 h-4" />
										Ver Resumos
									</button>
								)}

								{!canGenerateSummary ? (
									<div className="flex flex-col items-center justify-center py-8 text-center">
										<div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
											<AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
										</div>
										<p className="text-sm font-medium mb-2">
											{limitReason === "no_minutes"
												? "Limite de minutos excedido"
												: "Limite de resumos por mídia atingido"}
										</p>
										<p className="text-xs text-muted-foreground mb-4">
											{limitReason === "no_minutes"
												? "Você não possui minutos restantes para gerar resumos."
												: `Você já usou ${summaryAttempts} resumos permitidos para esta mídia.`}
										</p>
										{onUpgrade && (
											<Button
												onClick={onUpgrade}
												className="bg-emerald-600 hover:bg-emerald-700"
											>
												Ver Planos
											</Button>
										)}
									</div>
								) : (
									<>
										{renderTemplatesList()}

										{isCustomPrompt && renderCustomPromptInput()}

										<Button
											onClick={handleGenerate}
											disabled={isGenerating || !canGenerate}
											className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-xl transition-all duration-200"
										>
											{isGenerating ? (
												<span className="flex items-center gap-2">
													<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
													Gerando resumo...
												</span>
											) : (
												<span className="flex items-center gap-2">
													<Sparkles className="w-4 h-4" />
													Gerar resumo
												</span>
											)}
										</Button>
									</>
								)}
							</>
						)}
					</div>
				)}

				{viewMode === "summary" && currentSummary && (
					<div className="p-6 space-y-4">
						<div className="prose dark:prose-invert prose-sm max-w-none">
							<div className="text-foreground leading-relaxed whitespace-pre-wrap">
								{currentSummary}
							</div>
						</div>
					</div>
				)}

				{viewMode === "summary" && !currentSummary && hasVersions && (
					<div className="p-6 space-y-4">
						<div className="prose dark:prose-invert prose-sm max-w-none">
							<div className="text-foreground leading-relaxed whitespace-pre-wrap">
								{summary[summary.length - 1]}
							</div>
						</div>
					</div>
				)}
			</div>

			{viewMode === "summary" && hasVersions && (
				<div className="p-4 border-t border-border space-y-2 shrink-0">
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={handleCopyMarkdown}
							className="flex-1 rounded-xl"
						>
							<Copy className="w-4 h-4 mr-2" />
							Copiar
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={handleDownloadPDF}
							className="flex-1 rounded-xl"
						>
							<Download className="w-4 h-4 mr-2" />
							PDF
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
