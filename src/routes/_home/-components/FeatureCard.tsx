import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
	icon: LucideIcon;
	title: string;
	description: string;
}

export function FeatureCard({
	icon: Icon,
	title,
	description,
}: FeatureCardProps) {
	return (
		<div className="group">
			<div className="bg-white dark:bg-stone-950 rounded-xl p-8 border border-stone-200 dark:border-stone-800 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-lg transition-all h-full">
				<div className="w-12 h-12 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4 group-hover:bg-teal-50 dark:group-hover:bg-teal-900 transition-colors">
					<Icon className="w-6 h-6 text-stone-700 dark:text-stone-300 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors" />
				</div>

				<h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
					{title}
				</h3>

				<p className="text-stone-600 dark:text-stone-400 leading-relaxed">
					{description}
				</p>
			</div>
		</div>
	);
}
