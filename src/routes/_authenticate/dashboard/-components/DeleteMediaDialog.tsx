import { Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/context/ToastContext";
import { useDeleteMedia } from "@/hooks/useMedia";
import { getApiErrorMessage } from "@/lib/api-error";
import type { Media } from "@/types/media";

interface DeleteMediaDialogProps {
	media: Media;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onDeleted?: () => void;
}

export function DeleteMediaDialog({
	media,
	open,
	onOpenChange,
	onDeleted,
}: DeleteMediaDialogProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const deleteMedia = useDeleteMedia();
	const { showToast } = useToast();

	async function handleConfirm() {
		setIsDeleting(true);

		try {
			await deleteMedia.mutateAsync(media.id);

			showToast("Mídia excluída com sucesso.", "success");
			onOpenChange(false);
			onDeleted?.();
		} catch (error) {
			console.error("Erro ao excluir mídia:", error);
			showToast(
				getApiErrorMessage(error, "Não foi possível excluir a mídia."),
				"error",
			);
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Excluir mídia</DialogTitle>
					<DialogDescription>
						Tem certeza que deseja excluir "{media.filename}"?
					</DialogDescription>
				</DialogHeader>

				<p className="text-sm text-muted-foreground">
					O arquivo será removido do storage e do banco de dados. Os minutos já
					consumidos <span className="font-medium">não serão devolvidos</span>
					ao seu plano mensal.
				</p>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isDeleting}
					>
						Cancelar
					</Button>
					<Button
						type="button"
						variant="destructive"
						onClick={handleConfirm}
						disabled={isDeleting}
					>
						{isDeleting ? (
							"Excluindo..."
						) : (
							<>
								<Trash2 className="w-4 h-4 mr-2" />
								Excluir
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
