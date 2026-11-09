import type { Media } from "@/types/media";
import { MediaTableRow } from "./MediaTableRow";

interface MediaTableProps {
	medias: Media[];
	onMediaClick?: (media: Media) => void;
	onMediaDelete?: (media: Media) => void;
}

export function MediaTable({
	medias,
	onMediaClick,
	onMediaDelete,
}: MediaTableProps) {
	return (
		<div className="bg-card rounded-xl border border-border overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-border bg-secondary/30">
							<th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
								Nome do arquivo
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
								Tipo
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
								Duração
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
								Tags
							</th>
							<th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
								Ações
							</th>
						</tr>
					</thead>
					<tbody>
						{medias.length === 0 ? (
							<tr>
								<td colSpan={6} className="px-6 py-12 text-center">
									<p className="text-muted-foreground">
										Nenhuma mídia encontrada
									</p>
								</td>
							</tr>
						) : (
							medias.map((media) => (
								<MediaTableRow
									key={media.id}
									media={media}
									onClick={() => onMediaClick?.(media)}
									onDelete={() => onMediaDelete?.(media)}
								/>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
