import { useUserLimits } from "@/hooks/useUserLimits";

export function PlanUsage() {
	const { user } = useUserLimits();

	if (!user) {
		return null;
	}

	const percentage = Math.min(
		(user.minutesUsed / user.plan.monthlyMinutesLimit) * 100,
		100,
	);

	const cycleEnd = new Date(user.cycleEnd);
	const resetDay = cycleEnd.getDate().toString().padStart(2, "0");
	const resetMonth = (cycleEnd.getMonth() + 1).toString().padStart(2, "0");

	const minutesRemaining = user.plan.monthlyMinutesLimit - user.minutesUsed;

	return (
		<div className="space-y-2">
			<div className="flex justify-between items-center text-xs">
				<span className="text-muted-foreground">
					{user.minutesUsed}/{user.plan.monthlyMinutesLimit} min
				</span>
				<span className="text-sm font-medium text-foreground">
					Restam {minutesRemaining} min
				</span>
				<span className="text-muted-foreground">
					Reset {resetDay}/{resetMonth}
				</span>
			</div>

			<div className="h-1.5 bg-secondary rounded-full overflow-hidden">
				<div
					className="h-full bg-emerald-500 rounded-full transition-all duration-300"
					style={{ width: `${percentage}%` }}
				/>
			</div>

			{percentage >= 80 && (
				<p className="text-xs text-amber-600 dark:text-amber-400">
					Limite próximo do fim
				</p>
			)}
		</div>
	);
}
