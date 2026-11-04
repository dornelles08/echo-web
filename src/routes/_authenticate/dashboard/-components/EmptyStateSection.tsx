import { CloudUpload, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyStateSectionProps {
	onOpenCreateMedia: () => void;
}

export function EmptyStateSection({
	onOpenCreateMedia,
}: EmptyStateSectionProps) {
	return (
		<div className="flex flex-col items-center justify-center py-20 px-8">
			<div className="text-center max-w-md">
				<div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 flex items-center justify-center">
					<CloudUpload className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
				</div>

				<h3 className="text-xl font-bold mb-3">Nenhuma mídia encontrada</h3>
				<p className="text-muted-foreground mb-8 text-center leading-relaxed">
					Comece adicionando suas primeiras mídias para transcrever e gerar
					resumos usando IA.
				</p>

				<Button
					onClick={onOpenCreateMedia}
					className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5"
				>
					<Plus className="w-4 h-4 mr-2" />
					Adicionar primeira mídia
				</Button>
			</div>
		</div>
	);
}
