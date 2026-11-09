import { zodResolver } from "@hookform/resolvers/zod";
import {
	AlertTriangle,
	CloudUpload,
	FileAudio,
	FileVideo,
	Loader2,
	Mic,
} from "lucide-react";
import { useCallback, useId, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { LanguageSelect } from "@/components/LanguageSelect";
import { TagInput } from "@/components/TagInput";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	formatFileSize,
	getAcceptedExtensions,
	UPLOAD_CONFIG,
	validateFileType,
} from "@/config/upload";
import { useToast } from "@/context/ToastContext";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useUploadAndCreateMedia } from "@/hooks/useUploadMedia";
import { useUserLimits } from "@/hooks/useUserLimits";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDuration } from "@/lib/duration";
import {
	type CreateMediaFormData,
	createMediaSchema,
} from "@/schemas/media.schema";
import { AudioRecorder } from "./AudioRecorder";

type InputMode = "upload" | "record";

interface UploadMediaModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateMediaModal({
	open,
	onOpenChange,
}: UploadMediaModalProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [dragActive, setDragActive] = useState(false);
	const [inputMode, setInputMode] = useState<InputMode>("upload");
	const [durationError, setDurationError] = useState<string | null>(null);
	const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

	const { canUploadVideo, validateDuration } = useUserLimits();
	const { showToast } = useToast();

	const {
		state: recorderState,
		startRecording,
		stopRecording,
		pauseRecording,
		resumeRecording,
		reset: resetRecorder,
		requestPermission,
		isSupported: isRecorderSupported,
	} = useAudioRecorder();

	const uploadMutation = useUploadAndCreateMedia();
	const filenameId = useId();
	const promptId = useId();
	const durationId = useId();

	const {
		register,
		control,
		handleSubmit,
		setValue,
		reset,
		resetField,
		watch,
		formState: { errors },
	} = useForm<CreateMediaFormData>({
		resolver: zodResolver(createMediaSchema),
		defaultValues: {
			filename: "",
			language: "pt-BR",
			duration: undefined,
			tags: [],
			prompt: "",
		},
	});

	const durationWatch = watch("duration");

	const handleFileSelect = useCallback(
		(file: File) => {
			setDurationError(null);

			if (file.size > UPLOAD_CONFIG.maxFileSize) {
				showToast(
					`Arquivo muito grande! Máximo: ${formatFileSize(UPLOAD_CONFIG.maxFileSize)}`,
					"error",
				);
				return;
			}

			const fileType = validateFileType(file);
			if (!fileType) {
				showToast("Tipo de arquivo não suportado!", "error");
				return;
			}

			if (fileType === "video" && !canUploadVideo) {
				setUpgradeModalOpen(true);
				return;
			}

			const handleDuration = (duration: number) => {
				setValue("duration", duration);
				const validation = validateDuration(duration);
				if (!validation.valid) {
					setDurationError(
						validation.message || "Arquivo excede tempo restante",
					);
					return;
				}
			};

			if (fileType === "audio") {
				const audio = new Audio();
				const objectUrl = URL.createObjectURL(file);
				audio.onloadedmetadata = () => {
					handleDuration(audio.duration);
					URL.revokeObjectURL(objectUrl);
				};
				audio.src = objectUrl;
			}
			if (fileType === "video") {
				const video = document.createElement("video");
				video.preload = "metadata";
				const objectUrl = URL.createObjectURL(file);
				video.onloadedmetadata = () => {
					handleDuration(video.duration);
					URL.revokeObjectURL(objectUrl);
				};
				video.src = objectUrl;
			}

			const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
			setValue("filename", fileNameWithoutExtension);
			setSelectedFile(file);
			setValue("file", file);
		},
		[setValue, canUploadVideo, validateDuration, showToast],
	);

	const handleDrag = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setDragActive(false);

			if (e.dataTransfer.files?.[0]) {
				handleFileSelect(e.dataTransfer.files[0]);
			}
		},
		[handleFileSelect],
	);

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			handleFileSelect(e.target.files[0]);
		}
	};

	const handleStartRecording = async () => {
		try {
			await requestPermission();
			await startRecording();
		} catch (error) {
			console.error("Erro ao iniciar gravação:", error);
			showToast(
				"Não foi possível acessar o microfone. Verifique as permissões.",
				"error",
			);
		}
	};

	const handleStopRecording = () => {
		stopRecording();
	};

	const handleConfirmRecording = useCallback(() => {
		if (recorderState.audioBlob) {
			const duration = recorderState.duration;
			const validation = validateDuration(duration);
			if (!validation.valid) {
				showToast(
					validation.message || "Gravação excede tempo restante",
					"error",
				);
				return;
			}

			const extension = "webm";
			const filename = `gravacao-${Date.now()}.${extension}`;
			const file = new File([recorderState.audioBlob], filename, {
				type: "audio/webm",
			});

			const fileNameWithoutExtension = filename.replace(/\.[^/.]+$/, "");
			setValue("filename", fileNameWithoutExtension);
			setSelectedFile(file);
			setValue("file", file);
			setValue("duration", recorderState.duration);
		}
	}, [
		recorderState.audioBlob,
		recorderState.duration,
		setValue,
		validateDuration,
		showToast,
	]);

	const handleResetRecording = () => {
		resetRecorder();
		setSelectedFile(null);
		resetField("file", { defaultValue: undefined });
		resetField("duration", { defaultValue: undefined });
		resetField("filename", { defaultValue: "" });
	};

	async function handleCreateMedia(data: CreateMediaFormData) {
		if (!selectedFile) return;

		const fileType = validateFileType(selectedFile);
		if (!fileType) return;

		try {
			await uploadMutation.mutateAsync({
				filename: data.filename,
				file: data.file,
				type: fileType,
				language: data.language,
				duration: data.duration,
				tags: data.tags,
				prompt: data.prompt,
			});

			reset();
			setSelectedFile(null);
			resetRecorder();
			setInputMode("upload");
			onOpenChange(false);
		} catch (error) {
			console.error("Erro ao fazer upload:", error);
		}
	}

	const getFileIcon = () => {
		if (!selectedFile)
			return <CloudUpload className="w-12 h-12 text-teal-600" />;

		const fileType = validateFileType(selectedFile);
		if (fileType === "video") {
			return <FileVideo className="w-12 h-12 text-teal-600" />;
		}
		return <FileAudio className="w-12 h-12 text-teal-600" />;
	};

	const canSubmit = selectedFile && !uploadMutation.isPending && !durationError;
	const isRecording = recorderState.status === "recording";
	const isPaused = recorderState.status === "paused";
	const hasRecording =
		recorderState.status === "stopped" && recorderState.audioUrl;

	const handleClose = () => {
		reset();
		setSelectedFile(null);
		resetRecorder();
		setInputMode("upload");
		setDurationError(null);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Adicionar nova mídia</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(handleCreateMedia)} className="space-y-6">
					{/* Mensagem de erro de duração */}
					{durationError && (
						<div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-300">
							<AlertTriangle className="w-4 h-4 shrink-0" />
							{durationError}
						</div>
					)}
					{/* Toggle Upload/Gravação */}
					<div className="flex gap-2 border-b border-stone-200 dark:border-stone-700 pb-4">
						<Button
							type="button"
							variant={inputMode === "upload" ? "default" : "outline"}
							onClick={() => {
								setInputMode("upload");
								setSelectedFile(null);
								resetField("file", { defaultValue: undefined });
								resetField("duration", { defaultValue: undefined });
								resetField("filename", { defaultValue: "" });
							}}
							className="flex-1"
						>
							<CloudUpload className="w-4 h-4 mr-2" />
							Upload
						</Button>
						<Button
							type="button"
							variant={inputMode === "record" ? "default" : "outline"}
							onClick={() => {
								setInputMode("record");
								setSelectedFile(null);
								resetField("file", { defaultValue: undefined });
								resetField("duration", { defaultValue: undefined });
								resetField("filename", { defaultValue: "" });
							}}
							disabled={!isRecorderSupported}
							className="flex-1"
						>
							<Mic className="w-4 h-4 mr-2" />
							Gravar
						</Button>
					</div>

					{inputMode === "upload" ? (
						/* Área de Upload */
						<div
							aria-hidden="true"
							onDragEnter={handleDrag}
							onDragLeave={handleDrag}
							onDragOver={handleDrag}
							onDrop={handleDrop}
							onClick={() => fileInputRef.current?.click()}
							className={`relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
								dragActive
									? "border-teal-600 bg-teal-50 dark:bg-teal-950"
									: "border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
							}`}
						>
							<input
								ref={fileInputRef}
								type="file"
								accept={getAcceptedExtensions(canUploadVideo)}
								onChange={handleFileInputChange}
								className="hidden"
							/>

							<div className="flex flex-col items-center justify-center text-center cursor-pointer">
								{getFileIcon()}

								{selectedFile ? (
									<>
										<p className="mt-4 text-sm font-medium text-stone-900 dark:text-white">
											{selectedFile.name}
										</p>
										<p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
											{formatFileSize(selectedFile.size)}
										</p>
									</>
								) : (
									<>
										<p className="mt-4 text-base font-medium text-stone-900 dark:text-white">
											Arraste seu arquivo aqui
										</p>
										<p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
											Suporta MP4, MP3, WAV, M4A (máx.{" "}
											{formatFileSize(UPLOAD_CONFIG.maxFileSize)})
										</p>
									</>
								)}

								<Button
									type="button"
									variant="outline"
									className="mt-4 cursor-pointer"
								>
									Ou escolha do computador
								</Button>
							</div>

							{errors.file && (
								<p className="text-red-500 text-xs mt-2 text-center">
									{errors.file.message}
								</p>
							)}
						</div>
					) : (
						/* Área de Gravação */
						<div className="space-y-4">
							{typeof window !== "undefined" && !window.isSecureContext && (
								<div className="rounded-lg border border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40 p-3 text-sm text-amber-800 dark:text-amber-200">
									<p className="font-medium mb-1">
										Microfone indisponível nesta conexão
									</p>
									<p>
										O navegador só libera o microfone em contextos seguros
										(HTTPS ou localhost). Para testar a gravação em rede local,
										abra{" "}
										<code className="px-1 rounded bg-amber-100 dark:bg-amber-900">
											chrome://flags/#unsafely-treat-insecure-origin-as-secure
										</code>
										, adicione a URL{" "}
										<code className="px-1 rounded bg-amber-100 dark:bg-amber-900">
											{window.location.origin}
										</code>{" "}
										e reinicie o Chrome. Alternativamente, use um túnel HTTPS
										(ngrok/cloudflared) ou rode o app via HTTPS.
									</p>
								</div>
							)}
							<AudioRecorder
								isRecording={isRecording}
								isPaused={isPaused}
								duration={recorderState.duration}
								audioUrl={recorderState.audioUrl}
								onStart={handleStartRecording}
								onStop={handleStopRecording}
								onPause={pauseRecording}
								onResume={resumeRecording}
								onReset={handleResetRecording}
							/>

							{hasRecording && (
								<div className="flex gap-2">
									<Button
										type="button"
										onClick={handleConfirmRecording}
										className="flex-1 bg-teal-600 hover:bg-teal-700"
									>
										Confirmar Gravação
									</Button>
								</div>
							)}

							{!isRecorderSupported && (
								<p className="text-sm text-amber-600 dark:text-amber-400 text-center">
									Seu navegador não suporta gravação de áudio.
								</p>
							)}
						</div>
					)}

					{/* Nome do arquivo */}
					<div>
						<Label
							htmlFor={filenameId}
							className="text-stone-900 dark:text-white mb-2 block"
						>
							Nome do arquivo
						</Label>
						<Input
							id={filenameId}
							{...register("filename")}
							placeholder="Digite o nome do arquivo"
							className={errors.filename ? "border-red-500" : ""}
						/>
						{errors.filename && (
							<p className="text-red-500 text-xs mt-1">
								{errors.filename.message}
							</p>
						)}
					</div>

					{/* Duração do arquivo (auto-preenchido) */}
					<div>
						<Label
							htmlFor={durationId}
							className="text-stone-900 dark:text-white mb-2 block"
						>
							Duração do arquivo
						</Label>
						<Input
							id={durationId}
							{...register("duration")}
							value={formatDuration(durationWatch)}
							disabled
							className="bg-stone-100 dark:bg-stone-800"
						/>
					</div>

					{/* Idioma */}
					<Controller
						name="language"
						control={control}
						render={({ field }) => (
							<LanguageSelect
								value={field.value || "pt-BR"}
								onChange={field.onChange}
								error={errors.language?.message}
							/>
						)}
					/>

					{/* Tags */}
					<Controller
						name="tags"
						control={control}
						render={({ field }) => (
							<TagInput
								tags={field.value}
								onChange={field.onChange}
								error={errors.tags?.message}
							/>
						)}
					/>

					{/* Prompt Contextual */}
					<div>
						<div className="flex items-center justify-between mb-2">
							<Label
								htmlFor={promptId}
								className="text-stone-900 dark:text-white"
							>
								Prompt Contextual
							</Label>
							<span className="text-xs text-teal-600 dark:text-teal-400 uppercase font-semibold">
								Opcional - Melhora a precisão
							</span>
						</div>
						<Textarea
							id={promptId}
							placeholder="Forneça contexto para a IA. Ex: 'Esta é uma entrevista técnica sobre Design Systems com foco em acessibilidade...'"
							{...register("prompt")}
							rows={4}
							className={errors.prompt ? "border-red-500" : ""}
						/>
						{errors.prompt && (
							<p className="text-red-500 text-xs mt-1">
								{errors.prompt.message}
							</p>
						)}
						<p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
							A IA usará este contexto para entender melhor termos técnicos,
							nomes próprios e o tom da conversa.
						</p>
					</div>

					{/* Mensagem de erro geral */}
					{uploadMutation.isError && (
						<div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
							{getApiErrorMessage(
								uploadMutation.error,
								"Erro ao fazer upload. Tente novamente.",
							)}
						</div>
					)}

					{/* Footer */}
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={handleClose}
							disabled={uploadMutation.isPending}
						>
							Cancelar
						</Button>
						<Button
							type="submit"
							disabled={!canSubmit}
							className="bg-teal-600 hover:bg-teal-700"
						>
							{uploadMutation.isPending ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Enviando...
								</>
							) : (
								"Enviar"
							)}
						</Button>
					</DialogFooter>
				</form>

				<UpgradeModal
					open={upgradeModalOpen}
					onOpenChange={setUpgradeModalOpen}
					reason="video_not_allowed"
				/>
			</DialogContent>
		</Dialog>
	);
}
