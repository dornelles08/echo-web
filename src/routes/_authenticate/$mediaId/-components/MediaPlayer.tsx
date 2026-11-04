import { Play, Volume2 } from "lucide-react";
import type { Media } from "@/types/media";

interface MediaPlayerProps {
	media: Media;
	onSeek?: (time: number) => void;
}

export function MediaPlayer({ media }: MediaPlayerProps) {
	// TODO: Implementar player real quando o backend estiver pronto
	const isVideo = media.type === "video";

	return (
		<div className="relative aspect-video bg-stone-900 dark:bg-stone-950 rounded-lg overflow-hidden border border-stone-800">
			{/* Placeholder */}
			<div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
				{isVideo ? (
					<div className="text-center">
						<Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
						<p className="text-sm font-medium">Player de vídeo</p>
						<p className="text-xs mt-1">Em desenvolvimento</p>
					</div>
				) : (
					<div className="text-center">
						<Volume2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
						<p className="text-sm font-medium">Player de áudio</p>
						<p className="text-xs mt-1">Em desenvolvimento</p>
					</div>
				)}
			</div>

			{/* Info overlay */}
			<div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4">
				<p className="text-white text-sm font-medium truncate">
					{media.filename}
				</p>
				<p className="text-stone-300 text-xs mt-1">
					{media.duration} • {media.type === "video" ? "Vídeo" : "Áudio"}
				</p>
			</div>
		</div>
	);
}
