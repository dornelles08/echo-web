import { FileIcon } from "lucide-react";

import { StatusBadge } from "@/components/StatusBadge";
import { formatDuration } from "@/lib/duration";
import type { Media } from "@/types/media";
import { MediaIcon } from "./MediaIcon";

interface MediaTableRowProps {
	media: Media;
	onClick?: () => void;
}

export function MediaTableRow({ media, onClick }: MediaTableRowProps) {
	return (
		<tr
			onClick={onClick}
			className="border-b border-border hover:bg-secondary/30 cursor-pointer transition-colors group"
		>
			<td className="px-6 py-4">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
						<FileIcon className="w-5 h-5 text-muted-foreground" />
					</div>
					<span className="text-sm font-medium">{media.filename}</span>
				</div>
			</td>

			<td className="px-6 py-4">
				<MediaIcon type={media.type} />
			</td>

			<td className="px-6 py-4">
				<span className="text-sm font-medium">
					{formatDuration(media.duration)}
				</span>
			</td>

			<td className="px-6 py-4">
				<StatusBadge status={media.status} />
			</td>

			<td className="px-6 py-4">
				<div className="flex items-center gap-2 flex-wrap">
					{media.tags.map((tag) => (
						<span
							key={tag}
							className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-secondary text-muted-foreground"
						>
							{tag}
						</span>
					))}
				</div>
			</td>
		</tr>
	);
}
