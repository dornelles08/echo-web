import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/context/ThemeContext";
import { authClient } from "@/lib/auth-client";

import logo from "../assets/Echo Light 1650x650 - sem fundo.png";

export const Route = createFileRoute("/_auth")({
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (session.data?.session) {
			throw redirect({ to: "/dashboard", search: { page: 1 } });
		}
	},
	component: AuthLayout,
});

function AuthLayout() {
	const { theme, toggleTheme } = useTheme();

	return (
		<div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
			<div className="absolute inset-0 -z-10">
				<div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-background dark:from-emerald-950/30 dark:via-background dark:to-background" />
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-200/20 dark:bg-emerald-800/10 rounded-full blur-3xl animate-pulse-glow" />
				<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-coral-100/20 dark:bg-coral-950/10 rounded-full blur-3xl animate-pulse-glow animation-delay-400" />
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiM1QjVGNTYiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-[0.3] dark:opacity-[0.15]" />
			</div>

			<button
				onClick={toggleTheme}
				className="absolute top-6 right-6 p-3 bg-card/80 backdrop-blur-sm hover:bg-secondary rounded-full shadow-lg border border-border/50 transition-all duration-300 hover:scale-105"
				aria-label={
					theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"
				}
				type="button"
			>
				{theme === "light" ? (
					<Moon className="w-5 h-5 text-muted-foreground" />
				) : (
					<Sun className="w-5 h-5 text-muted-foreground" />
				)}
			</button>

			<div className="w-full max-w-md">
				<div className="relative">
					<div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/10 via-coral/5 to-transparent rounded-3xl blur-xl" />
					<div className="relative bg-card/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 p-8">
						<div className="mb-8 text-center">
							<img src={logo} alt="Echo Logo" className="h-12 mx-auto mb-6" />
						</div>
						<Outlet />
					</div>
				</div>

				<div className="text-center mt-8">
					<p className="text-xs text-muted-foreground/60 uppercase tracking-[0.2em]">
						ECHO AI SYSTEMS
					</p>
				</div>
			</div>
		</div>
	);
}
