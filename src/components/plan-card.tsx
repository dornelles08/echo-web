import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { planBadgeMap, planFeaturesMap } from "@/lib/plan-features";
import priceFormatter from "@/utils/priceFormatter";

interface PlanCardProps {
	plan: {
		id: string;
		name: string;
		description: string | null;
		price: number;
		monthlyMinutesLimit: number;
	};
	isCurrent?: boolean;
	isPopular?: boolean;
	onSelect?: () => void;
}

export function PlanCard({
	plan,
	isCurrent,
	isPopular,
	onSelect,
}: PlanCardProps) {
	const features = planFeaturesMap[plan.name] || [];
	const badge = planBadgeMap[plan.name];

	const priceFormatted = priceFormatter(plan.price);

	return (
		<div
			className={`relative flex flex-col rounded-2xl p-1 transition-all duration-300 hover:-translate-y-2 ${
				isPopular
					? "bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 shadow-xl shadow-emerald-500/20"
					: "bg-card border border-border hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10"
			}`}
		>
			{badge && (
				<div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
					<div
						className={`rounded-full px-4 py-1.5 text-xs font-semibold shadow-lg whitespace-nowrap ${
							isPopular
								? "bg-white text-emerald-700"
								: "bg-emerald-600 text-white"
						}`}
					>
						{badge}
					</div>
				</div>
			)}

			{isCurrent && (
				<div className="absolute -top-3 right-4 z-10 rounded-full bg-green-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-green-500/30">
					Atual
				</div>
			)}

			<div
				className={`flex-1 rounded-xl p-6 ${
					isPopular ? "bg-emerald-600 dark:bg-emerald-500" : "bg-card"
				}`}
			>
				<div className="mb-4">
					<h3
						className={`text-lg font-bold ${
							isPopular ? "text-white" : "text-foreground"
						}`}
					>
						{plan.name}
					</h3>
					<p
						className={`mt-1 text-sm ${
							isPopular ? "text-emerald-100" : "text-muted-foreground"
						}`}
					>
						{plan.description}
					</p>
					<p
						className={`mt-2 text-sm font-medium ${
							isPopular ? "text-emerald-200" : "text-muted-foreground"
						}`}
					>
						{plan.monthlyMinutesLimit} minutos de processamento por mês
					</p>
				</div>

				<div className="mb-6">
					<span
						className={`text-4xl font-bold ${
							isPopular ? "text-white" : "text-foreground"
						}`}
					>
						{priceFormatted}
					</span>
					{plan.price > 0 && (
						<span
							className={`text-sm ${
								isPopular ? "text-emerald-100" : "text-muted-foreground"
							}`}
						>
							/mês
						</span>
					)}
				</div>

				<ul className="mb-6 space-y-3">
					{features.map((feature) => (
						<li key={feature.text} className="flex items-start gap-2 text-sm">
							{feature.included ? (
								<Check
									className={`mt-0.5 size-4 shrink-0 ${
										isPopular ? "text-white" : "text-emerald-500"
									}`}
								/>
							) : (
								<X className="mt-0.5 size-4 shrink-0 text-muted-foreground/50" />
							)}
							<span
								className={
									feature.included
										? isPopular
											? "text-emerald-50"
											: "text-muted-foreground"
										: "text-muted-foreground/50"
								}
							>
								{feature.text}
							</span>
						</li>
					))}
				</ul>

				<Button
					onClick={onSelect}
					variant={isPopular ? "default" : "outline"}
					className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 ${
						isPopular
							? "bg-white text-emerald-700 hover:bg-emerald-50"
							: "border-2 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700 dark:hover:bg-emerald-950 dark:hover:border-emerald-400"
					}`}
					disabled={isCurrent}
				>
					{isCurrent ? "Plano Atual" : "Escolher Plano"}
				</Button>
			</div>
		</div>
	);
}
