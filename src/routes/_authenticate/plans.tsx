import {
	createFileRoute,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useState } from "react";

import { PlanCard } from "@/components/plan-card";
import { PlanComparisonModal } from "@/components/plan-comparison-modal";
import { useProfile } from "@/hooks/useAuth";
import { usePlans } from "@/hooks/usePlans";

export const Route = createFileRoute("/_authenticate/plans")({
	component: PlansPage,
	validateSearch: (search: Record<string, unknown>) => ({
		plan: search.plan as string | undefined,
	}),
});

function PlansPage() {
	const navigate = useNavigate();
	const { plan: selectedPlanId } = useSearch({ from: "/_authenticate/plans" });
	const { data: plans, isLoading } = usePlans();
	const { data: user } = useProfile();
	const [isModalOpen, setIsModalOpen] = useState(!!selectedPlanId);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="flex flex-col items-center gap-4">
					<div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
					<p className="text-muted-foreground">Carregando planos...</p>
				</div>
			</div>
		);
	}

	if (!plans || !user) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<p className="text-muted-foreground">Erro ao carregar dados</p>
			</div>
		);
	}

	const currentPlan = plans.find(({ id }) => id === user.plan.id);
	const selectedPlan = plans.find(({ id }) => id === selectedPlanId);

	const handlePlanSelect = (planId: string) => {
		navigate({
			to: "/plans",
			search: { plan: planId },
		});
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		navigate({
			to: "/plans",
			search: { plan: undefined },
		});
	};

	const sortedPlans = [...plans].sort(
		(a, b) => a.monthlyMinutesLimit - b.monthlyMinutesLimit,
	);

	return (
		<div className="min-h-full bg-background relative overflow-x-hidden">
			<div className="absolute inset-0 -z-10">
				<div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-background to-background dark:from-emerald-950/20 dark:via-background dark:to-background" />
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-200/15 dark:bg-emerald-800/10 rounded-full blur-3xl" />
				<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-coral-100/15 dark:bg-coral-950/10 rounded-full blur-3xl" />
			</div>

			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12">
				<div className="mb-12 text-center">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm text-muted-foreground mb-6">
						<Sparkles className="w-4 h-4 text-emerald-500" />
						Planos flexíveis
					</div>
					<h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
						Escolha seu Plano
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
						Selecione o plano ideal para suas necessidades. Faça upgrade ou
						downgrade a qualquer momento.
					</p>
				</div>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{sortedPlans.map((plan) => (
						<PlanCard
							key={plan.id}
							plan={plan}
							isCurrent={plan.id === currentPlan?.id}
							isPopular={plan.name === "Pro"}
							onSelect={() => handlePlanSelect(plan.id)}
						/>
					))}
				</div>
			</div>

			{selectedPlan && currentPlan && (
				<PlanComparisonModal
					isOpen={isModalOpen}
					onClose={handleCloseModal}
					currentPlan={currentPlan}
					selectedPlan={selectedPlan}
				/>
			)}
		</div>
	);
}
