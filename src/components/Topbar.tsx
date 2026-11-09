import { Link, useLocation } from "@tanstack/react-router";
import { ChevronDown, LayoutGrid, LogOut, Menu, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLogout } from "@/hooks/useAuth";
import { useUserLimits } from "@/hooks/useUserLimits";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { PlanUsage } from "./PlanUsage";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const menuItems = [
	{
		label: "Dashboard",
		href: "/dashboard",
	},
	{
		label: "Planos",
		href: "/plans",
	},
];

export function Topbar() {
	const location = useLocation();
	const logoutMutation = useLogout();
	const { user } = useUserLimits();
	const { theme, toggleTheme } = useTheme();

	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const userInitial = user?.name
		? user.name
				.split(" ")
				.map((n: string) => n[0])
				.join("")
				.slice(0, 2)
				.toUpperCase()
		: "??";

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<header className="h-16 border-b border-border bg-card">
			<div className="h-full md:px-6 flex items-center justify-between">
				<div className="flex items-center gap-4 md:gap-8">
					<Link to="/dashboard" search={{ page: 1 }}>
						<Logo />
					</Link>

					<nav className="hidden md:flex items-center gap-1">
						{menuItems.map((item) => {
							const isActive = location.pathname === item.href;
							return (
								<Link
									key={item.href}
									to={item.href}
									search={{ page: 1 }}
									className={cn(
										"px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
										isActive
											? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
											: "text-muted-foreground hover:text-foreground hover:bg-secondary",
									)}
								>
									{item.label}
								</Link>
							);
						})}
					</nav>
				</div>

				<div className="flex items-center gap-2 md:gap-4">
					<button
						onClick={toggleTheme}
						className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
						aria-label="Alternar tema"
						type="button"
					>
						{theme === "light" ? (
							<Moon className="w-5 h-5" />
						) : (
							<Sun className="w-5 h-5" />
						)}
					</button>

					<div className="relative hidden md:block" ref={dropdownRef}>
						<button
							type="button"
							onClick={() => setDropdownOpen(!dropdownOpen)}
							aria-expanded={dropdownOpen}
							aria-haspopup="menu"
							className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-secondary transition-colors"
						>
							<div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-semibold">
								{userInitial}
							</div>
							<ChevronDown className="w-4 h-4 text-muted-foreground" />
						</button>

						{dropdownOpen && (
							<div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
								<div className="p-4 border-b border-border">
									<p className="font-medium truncate">
										{user?.name || "Carregando..."}
									</p>
									<p className="text-sm text-muted-foreground truncate">
										{user?.plan.name || "Plano"}
									</p>
								</div>

								<div className="p-4 border-b border-border">
									<PlanUsage />
								</div>

								<div className="p-2">
									<button
										type="button"
										onClick={() => logoutMutation.mutate()}
										className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
									>
										<LogOut className="w-4 h-4" />
										Sair
									</button>
								</div>
							</div>
						)}
					</div>

					<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
						<SheetTrigger asChild className="md:hidden">
							<Button
								variant="ghost"
								size="icon"
								className="md:hidden"
								aria-label="Abrir menu"
							>
								<Menu className="w-5 h-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-80 p-0">
							<div className="flex flex-col h-full">
								<div className="p-4 border-b border-border flex items-center justify-between">
									<Logo />
								</div>

								<nav className="p-4">
									{menuItems.map((item) => {
										const isActive = location.pathname === item.href;
										return (
											<Link
												key={item.href}
												to={item.href}
												search={{ page: 1 }}
												onClick={() => setMobileMenuOpen(false)}
												className={cn(
													"flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 mb-1",
													isActive
														? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
														: "text-muted-foreground hover:text-foreground hover:bg-secondary",
												)}
											>
												<LayoutGrid className="w-5 h-5" />
												{item.label}
											</Link>
										);
									})}
								</nav>

								<div className="mt-auto p-4 border-t border-border">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-semibold">
											{userInitial}
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-medium truncate">
												{user?.name || "Carregando..."}
											</p>
											<p className="text-sm text-muted-foreground truncate">
												{user?.plan.name || "Plano"}
											</p>
										</div>
									</div>

									<div className="mb-4">
										<PlanUsage />
									</div>

									<Button
										variant="outline"
										className="w-full justify-start text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
										onClick={() => logoutMutation.mutate()}
									>
										<LogOut className="w-4 h-4 mr-2" />
										Sair
									</Button>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
