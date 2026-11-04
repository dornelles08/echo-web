import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface UpgradeModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	reason?: "limit_exceeded" | "video_not_allowed";
}

export function UpgradeModal({
	open,
	onOpenChange,
	reason = "limit_exceeded",
}: UpgradeModalProps) {
	const navigate = useNavigate();

	const handleUpgrade = () => {
		onOpenChange(false);
		navigate({ to: "/plans", search: { plan: undefined } });
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<AlertTriangle className="w-5 h-5 text-amber-500" />
						Limite Atingido
					</DialogTitle>
					<DialogDescription className="pt-2">
						{reason === "limit_exceeded"
							? "Você excedeu seu limite de minutos do plano atual."
							: "Seu plano atual não inclui upload de vídeos."}
					</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<p className="text-sm text-muted-foreground">
						{reason === "limit_exceeded"
							? "Faça upgrade do seu plano para continuar usando todos os recursos da plataforma."
							: "Assine um plano que permita upload de vídeos para continuar."}
					</p>
				</div>

				<div className="flex gap-3">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						className="flex-1"
					>
						<X className="w-4 h-4 mr-2" />
						Fechar
					</Button>
					<Button
						onClick={handleUpgrade}
						className="flex-1 bg-emerald-600 hover:bg-emerald-700"
					>
						Ver Planos
						<ArrowRight className="w-4 h-4 ml-2" />
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
