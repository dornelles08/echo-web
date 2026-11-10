import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import type { Provider } from "@/hooks/useAuth";

interface SocialSignInButtonsProps {
	availableProviders: Provider[];
	onSignIn: (provider: Provider) => void;
	isSubmitting?: boolean;
}

export function SocialSignInButtons({
	availableProviders,
	onSignIn,
	isSubmitting,
}: SocialSignInButtonsProps) {
	if (availableProviders.length === 0) {
		return null;
	}

	const socialProviders: {
		name: Provider;
		icon: React.ReactNode;
		label: string;
	}[] = [
		{
			name: "google",
			icon: <Icons.google className="w-5 h-5" />,
			label: "Continuar com Google",
		},
		{
			name: "github",
			icon: <Icons.github className="w-5 h-5" />,
			label: "Continuar com GitHub",
		},
	];

	const providersToShow = socialProviders.filter((p) =>
		availableProviders.includes(p.name),
	);

	return (
		<div className="space-y-3">
			{providersToShow.map((provider) => (
				<Button
					key={provider.name}
					variant="outline"
					className="w-full h-12 rounded-xl text-base font-medium border-2 border-border hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all duration-300"
					onClick={() => onSignIn(provider.name)}
					disabled={isSubmitting}
				>
					<span className="mr-3">{provider.icon}</span>
					{provider.label}
				</Button>
			))}
		</div>
	);
}
