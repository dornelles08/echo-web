import { AlertCircle, Clock, HelpCircle, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import { useRetryTranscription } from "@/hooks/useMedia";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDuration } from "@/lib/duration";

interface TranscriptionRetryCardProps {
	media: {
		id: string;
		filename: string;
		duration: number;
		status: string;
		transcriptionAttempts: number;
	};
	onSuccess?: () => void;
}

const MAX_ATTEMPTS = 3;

/**
 * Card explicativo e acionável exibido quando a transcrição de um áudio falha.
 *
 * O objetivo é deixar o cliente ciente de:
 * 1. O que aconteceu (transcrição não foi concluída).
 * 2. Que os minutos já foram debitados do plano, mas podem ser devolvidos.
 * 3. Que ele pode tentar novamente (até 3 vezes).
 * 4. Que após 3 falhas, os minutos são reembolsados e ele deve procurar o suporte.
 */
export function TranscriptionRetryCard({
	media,
	onSuccess,
}: TranscriptionRetryCardProps) {
	const retryTranscription = useRetryTranscription();
	const { showToast } = useToast();
	const [retryError, setRetryError] = useState<string | null>(null);

	const attemptsUsed = media.transcriptionAttempts ?? 0;
	const canRetry =
		attemptsUsed < MAX_ATTEMPTS && media.status === "failed_transcription";
	const minutes = Math.ceil(media.duration / 60);

	const handleRetry = async () => {
		setRetryError(null);

		if (!canRetry) return;

		try {
			await retryTranscription.mutateAsync(media.id);
			onSuccess?.();
			showToast(
				"Transcrição reativada! Estamos processando novamente o seu áudio.",
				"success",
			);
		} catch (error) {
			const message = getApiErrorMessage(
				error,
				"Não foi possível reativar a transcrição. Tente novamente.",
			);
			setRetryError(message);
			showToast(message, "error");
		}
	};

	if (media.status !== "failed_transcription") {
		return null;
	}

	return (
		<div
			className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6 mb-6"
			role="alert"
			aria-live="polite"
		>
			<div className="flex items-start gap-4">
				<AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />

				<div className="flex-1">
					<div className="flex items-center gap-2 mb-2">
						<h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
							Transcrição não concluída
						</h3>
						{attemptsUsed > 0 && (
							<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400">
								Tentativa {attemptsUsed} de {MAX_ATTEMPTS}
							</span>
						)}
					</div>

					<p className="text-sm text-red-700 dark:text-red-300 mb-4">
						Não conseguimos transcrever o áudio
						<strong>"{media.filename}"</strong>. Isso pode acontecer por
						problemas temporários de serviço, formato do arquivo ou
						indisponibilidade do provedor de transcrição.
					</p>

					{/* Explicação do reembolso de minutos */}
					<div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-4">
						<div className="flex items-start gap-3">
							<Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
							<div>
								<p className="text-xs font-semibold text-amber-800 dark:text-amber-200 mb-1">
									Seus minutos não foram desperdiçados
								</p>
								<p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
									Os {minutes} minuto(s) deste arquivo já foram debitados do seu
									plano. Se a transcrição continuar falhando após {MAX_ATTEMPTS}{" "}
									tentativas, devolvemos esses minutos automaticamente para você
									usar em outro arquivo.
								</p>
							</div>
						</div>
					</div>

					{/* Ação de retry ou mensagem de suporte */}
					{canRetry ? (
						<div className="space-y-3">
							<Button
								type="button"
								onClick={handleRetry}
								disabled={retryTranscription.isPending}
								className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white flex items-center justify-center gap-2"
							>
								{retryTranscription.isPending ? (
									<RefreshCw className="w-4 h-4 animate-spin" />
								) : (
									<RefreshCw className="w-4 h-4" />
								)}
								{retryTranscription.isPending
									? "Reprocessando..."
									: `Tentar transcrever novamente (${MAX_ATTEMPTS - attemptsUsed} restante(s))`}
							</Button>

							{retryError && (
								<p className="text-xs text-red-600 dark:text-red-400">
									{retryError}
								</p>
							)}
						</div>
					) : (
						<div className="space-y-2">
							<Button
								type="button"
								disabled
								variant="outline"
								className="w-full text-red-500 border-red-200 dark:border-red-800 dark:text-red-400"
							>
								<HelpCircle className="w-4 h-4 mr-2" />
								Limite de tentativas atingido
							</Button>

							<p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
								Após <strong>{MAX_ATTEMPTS} tentativas</strong>, não foi
								possível transcrever este áudio. Os
								<strong>{minutes} minuto(s)</strong> foram reembolsados ao seu
								plano.
							</p>

							<div className="flex items-start gap-3 pt-2">
								<HelpCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
								<div>
									<p className="text-xs font-semibold text-red-800 dark:text-red-300 mb-1">
										Precisa de ajuda?
									</p>
									<p className="text-xs text-red-700 dark:text-red-400">
										Entre em contato com o nosso suporte para investigarmos o
										problema deste arquivo.
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
