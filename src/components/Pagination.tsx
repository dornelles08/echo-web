import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PaginationInfo } from "@/types/media";

interface PaginationProps {
	pagination: PaginationInfo;
	onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
	const { page, totalPages, total, perPage } = pagination;

	const startItem = (page - 1) * perPage + 1;
	const endItem = Math.min(page * perPage, total);

	return (
		<div className="flex items-center justify-between mt-6">
			<p className="text-sm text-stone-600 dark:text-stone-400">
				Mostrando {startItem} a {endItem} de {total} arquivos
			</p>

			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(page - 1)}
					disabled={page === 1}
					className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800"
				>
					<ChevronLeft className="w-4 h-4 mr-1" />
					Anterior
				</Button>

				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(page + 1)}
					disabled={page === totalPages}
					className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800"
				>
					Próximo
					<ChevronRight className="w-4 h-4 ml-1" />
				</Button>
			</div>
		</div>
	);
}
