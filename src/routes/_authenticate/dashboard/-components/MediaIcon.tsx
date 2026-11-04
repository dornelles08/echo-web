import { Mic, Video } from "lucide-react";

import { cn } from "@/lib/utils";
import type { MediaType } from "@/types/media";

interface MediaIconProps {
	type?: MediaType;
	className?: string;
}

export function MediaIcon({ type, className }: MediaIconProps) {
	const Icon = type === "video" ? Video : Mic;

	return (
		<div
			className={cn(
				"flex items-center justify-center text-stone-600 dark:text-stone-400",
				className,
			)}
		>
			<Icon className="w-5 h-5" />
		</div>
	);
}
