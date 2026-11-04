interface PauseMarkerProps {
	duration?: string;
}

export function PauseMarker({ duration }: PauseMarkerProps) {
	return (
		<div className="flex items-center gap-3 py-2 px-4">
			<div className="flex-1 h-px bg-border" />
			<span className="text-xs text-muted-foreground font-medium">
				{duration ? `pausa (${duration})` : "pausa longa"}
			</span>
			<div className="flex-1 h-px bg-border" />
		</div>
	);
}
