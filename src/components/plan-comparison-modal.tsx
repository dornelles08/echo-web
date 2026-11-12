import { ArrowRight, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { planFeaturesMap } from "@/lib/plan-features";
import priceFormatter from "@/utils/priceFormatter";

interface Plan {
	id: string;
	name: string;
	price: number;
	monthlyMinutesLimit: number;
}

interface PlanComparisonModalProps {
	isOpen: boolean;
	onClose: () => void;
	currentPlan: Plan;
	selectedPlan: Plan;
}

export function PlanComparisonModal({
	isOpen,
	onClose,
	currentPlan,
	selectedPlan,
}: PlanComparisonModalProps) {
	const isUpgrade =
		selectedPlan.monthlyMinutesLimit > currentPlan.monthlyMinutesLimit;
	const actionText = isUpgrade ? "Upgrade" : "Downgrade";

	const currentFeatures = planFeaturesMap[currentPlan.name] || [];
	const selectedFeatures = planFeaturesMap[selectedPlan.name] || [];

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto bg-card border-border">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl font-bold">
						Confirmar {actionText}
					</DialogTitle>
				</DialogHeader>

				<div className="mt-6 grid gap-6 md:grid-cols-2">
					<div className="relative rounded-2xl border border-border bg-secondary/30 p-6">
						<div className="mb-4 flex items-center justify-between">
							<h3 className="text-lg font-semibold">Plano Atual</h3>
							<span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
								{currentPlan.name}
							</span>
						</div>
						<p className="mb-4 text-3xl font-bold">
							{priceFormatter(currentPlan.price)}
							<span className="text-sm font-normal text-muted-foreground">
								/mês
							</span>
						</p>
						<ul className="space-y-2">
							{currentFeatures.map((feature) => (
								<li
									key={feature.text}
									className="flex items-center gap-2 text-sm text-muted-foreground"
								>
									{feature.included ? (
										<Check className="size-4 text-emerald-500" />
									) : (
										<X className="size-4 text-muted-foreground/50" />
									)}
									{feature.text}
								</li>
							))}
						</ul>
					</div>

					<div className="relative rounded-2xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-card p-6 shadow-lg shadow-emerald-500/10">
						{isUpgrade && (
							<div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
								<span className="rounded-full bg-emerald-500 px-4 py-1 text-xs font-semibold text-white shadow-lg whitespace-nowrap">
									Melhor escolha
								</span>
							</div>
						)}
						<div className="mb-4 flex items-center justify-between">
							<h3 className="text-lg font-semibold">Novo Plano</h3>
							<span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium text-white">
								{selectedPlan.name}
							</span>
						</div>
						<p className="mb-4 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
							{priceFormatter(selectedPlan.price)}
							<span className="text-sm font-normal text-muted-foreground">
								/mês
							</span>
						</p>
						<ul className="space-y-2">
							{selectedFeatures.map((feature) => (
								<li
									key={feature.text}
									className="flex items-center gap-2 text-sm text-muted-foreground"
								>
									{feature.included ? (
										<Check className="size-4 text-emerald-500" />
									) : (
										<X className="size-4 text-muted-foreground/50" />
									)}
									{feature.text}
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="mt-8 flex items-center justify-center gap-4 text-muted-foreground">
					<span className="font-medium">{currentPlan.name}</span>
					<ArrowRight className="size-5" />
					<span className="font-bold text-emerald-600 dark:text-emerald-400">
						{selectedPlan.name}
					</span>
				</div>

				<div className="mt-8 flex flex-col gap-3">
					<Button
						size="lg"
						className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 h-12 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
						disabled
						title="A troca de plano será habilitada junto com o faturamento."
					>
						{actionText} em breve
					</Button>
					<p className="text-center text-xs text-muted-foreground">
						A troca de plano ainda não está disponível. Fale com o suporte para
						alterar seu plano.
					</p>
					<Button
						variant="outline"
						size="lg"
						className="w-full h-12 rounded-xl font-medium"
						onClick={onClose}
					>
						Voltar
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
