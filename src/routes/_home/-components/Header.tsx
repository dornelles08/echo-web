import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

export function Header() {
	const { theme, toggleTheme } = useTheme();

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
			<div className="container mx-auto px-4 md:px-8">
				<div className="flex items-center justify-between h-20">
					<div className="flex-shrink-0">
						<Logo />
					</div>

					<nav className="hidden md:flex items-center gap-10">
						<a
							href="#funciona"
							className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
						>
							Como funciona
							<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 transition-all duration-300 group-hover:w-full" />
						</a>
						<a
							href="#planos"
							className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
						>
							Planos
							<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 transition-all duration-300 group-hover:w-full" />
						</a>
					</nav>

					<div className="flex items-center gap-4">
						<button
							onClick={toggleTheme}
							className="p-2.5 rounded-xl hover:bg-secondary transition-all duration-300 text-muted-foreground hover:text-foreground"
							aria-label={
								theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"
							}
							type="button"
						>
							{theme === "light" ? (
								<Moon className="w-5 h-5" />
							) : (
								<Sun className="w-5 h-5" />
							)}
						</button>
						<Link to="/sign-in" search={{ plan: undefined }}>
							<Button className="bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-7 h-11 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25">
								Começar agora
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
}
