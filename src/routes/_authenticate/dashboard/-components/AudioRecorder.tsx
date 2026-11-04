import { Mic, Pause, Play, Square, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

interface AudioRecorderProps {
	isRecording: boolean;
	isPaused: boolean;
	duration: number;
	audioUrl: string | null;
	onStart: () => void;
	onStop: () => void;
	onPause: () => void;
	onResume: () => void;
	onReset: () => void;
}

function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function AudioRecorder({
	isRecording,
	isPaused,
	duration,
	audioUrl,
	onStart,
	onStop,
	onPause,
	onResume,
	onReset,
}: AudioRecorderProps) {
	const audioRef = useRef<HTMLAudioElement>(null);

	useEffect(() => {
		if (audioUrl && audioRef.current) {
			audioRef.current.src = audioUrl;
		}
	}, [audioUrl]);

	const isStopped = !isRecording && !isPaused && audioUrl;

	return (
		<div className="flex flex-col items-center gap-4 p-6 bg-stone-50 dark:bg-stone-800 rounded-lg">
			{!audioUrl && !isRecording ? (
				<div className="text-center">
					<p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
						Clique no botão para iniciar a gravação
					</p>
				</div>
			) : null}

			<div className="flex items-center gap-4">
				{isRecording || isPaused ? null : !audioUrl ? (
					<Button
						type="button"
						onClick={onStart}
						className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
					>
						<Mic className="w-6 h-6 text-white" />
					</Button>
				) : null}

				{isRecording && (
					<>
						<Button
							type="button"
							onClick={onPause}
							className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center"
						>
							<Pause className="w-5 h-5 text-white" />
						</Button>
						<Button
							type="button"
							onClick={onStop}
							className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center animate-pulse"
						>
							<Square className="w-6 h-6 text-white" />
						</Button>
					</>
				)}

				{isPaused && (
					<>
						<Button
							type="button"
							onClick={onResume}
							className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center"
						>
							<Play className="w-5 h-5 text-white" />
						</Button>
						<Button
							type="button"
							onClick={onStop}
							className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
						>
							<Square className="w-6 h-6 text-white" />
						</Button>
					</>
				)}

				{isStopped && audioUrl && (
					<Button
						type="button"
						onClick={onReset}
						variant="outline"
						className="h-10"
					>
						<Trash2 className="w-4 h-4 mr-2" />
						Gravar Novamente
					</Button>
				)}
			</div>

			{(isRecording || isPaused) && (
				<div className="text-center">
					<div className="text-3xl font-mono font-bold text-stone-700 dark:text-stone-300">
						{formatDuration(duration)}
					</div>
					<p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
						{isPaused ? "Pausado" : "Gravando..."}
					</p>
				</div>
			)}

			{isStopped && audioUrl && (
				<div className="w-full">
					{/* biome-ignore lint/a11y/useMediaCaption: Recorded audio playback */}
					<audio ref={audioRef} controls className="w-full" />
				</div>
			)}

			{isStopped && (
				<p className="text-sm text-green-600 dark:text-green-400">
					Gravação concluída! Clique em "Gravar Novamente" para refazer.
				</p>
			)}
		</div>
	);
}
