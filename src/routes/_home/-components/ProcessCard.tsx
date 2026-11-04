import type { LucideIcon } from "lucide-react";

interface ProcessCardProps {
	icon: LucideIcon;
	step: string;
	title: string;
	description: string;
	iconColor: "teal" | "orange" | "stone";
}

const iconColorClasses = {
	teal: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-400",
	orange:
		"bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-400",
	stone: "bg-stone-800 text-white dark:bg-stone-700 dark:text-stone-200",
};

const badgeColorClasses = {
	teal: "bg-teal-700 dark:bg-teal-600",
	orange: "bg-orange-600 dark:bg-orange-500",
	stone: "bg-stone-800 dark:bg-stone-700",
};

export function ProcessCard({
	icon: Icon,
	step,
	title,
	description,
	iconColor,
}: ProcessCardProps) {
	return (
		<div className="relative bg-stone-50 dark:bg-stone-900 rounded-xl p-8 border border-stone-200 dark:border-stone-800 hover:shadow-lg transition-shadow">
			<div className="absolute -top-3 -left-3">
				<div
					className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${badgeColorClasses[iconColor]}`}
				>
					{step}
				</div>
			</div>

			<div
				className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${iconColorClasses[iconColor]}`}
			>
				<Icon className="w-7 h-7" />
			</div>

			<h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
				{title}
			</h3>

			<p className="text-stone-600 dark:text-stone-400 leading-relaxed">
				{description}
			</p>
		</div>
	);
}
