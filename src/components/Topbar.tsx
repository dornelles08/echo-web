import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, LogOut, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLogout } from "@/hooks/useAuth";
import { useUserLimits } from "@/hooks/useUserLimits";
import { Logo } from "./Logo";
import { PlanUsage } from "./PlanUsage";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export function Topbar() {
	const navigate = useNavigate();
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

	const handleGoToConta = () => {
		setDropdownOpen(false);
		setMobileMenuOpen(false);
		navigate({ to: "/conta" });
	};

	const handleGoToPlanos = () => {
		setDropdownOpen(false);
		setMobileMenuOpen(false);
		navigate({ to: "/plans", search: { plan: undefined } });
	};

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
				<div className="flex items-center gap-4">
					<Link to="/dashboard" search={{ page: 1 }}>
						<Logo />
					</Link>
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
								<button
									type="button"
									onClick={handleGoToConta}
									className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors"
								>
									<div className="flex-1 min-w-0">
										<p className="font-medium truncate">
											{user?.name || "Carregando..."}
										</p>
										<p className="text-sm text-muted-foreground truncate">
											{user?.plan.name || "Plano"}
										</p>
									</div>
									<ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
								</button>

								<div className="p-4 border-b border-border">
									<PlanUsage />
								</div>

								<div className="p-2">
									<button
										type="button"
										onClick={handleGoToPlanos}
										className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors"
									>
										{TrocarIcon()} Trocar de plano
									</button>
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
								{MenuIcon()}
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-80 p-0">
							<div className="flex flex-col h-full">
								<div className="p-4 border-b border-border flex items-center justify-between">
									<Logo />
								</div>

								<div className="mt-auto p-4 border-t border-border">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-semibold">
											{userInitial}
										</div>
										<div className="flex-1 min-w-0">
											<button
												type="button"
												onClick={handleGoToConta}
												className="font-medium truncate text-foreground hover:text-emerald-600 dark:hover:text-emerald-400"
											>
												{user?.name || "Carregando..."}
											</button>
											<p className="text-sm text-muted-foreground truncate">
												{user?.plan.name || "Plano"}
											</p>
										</div>
									</div>

									<div className="mb-4">
										<PlanUsage />
									</div>

									<div className="mb-4">
										<button
											type="button"
											onClick={handleGoToPlanos}
											className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors"
										>
											{TrocarIcon()} Trocar de plano
										</button>
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

function MenuIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			role="img"
			aria-label="Abrir menu"
		>
			<line x1="3" y1="12" x2="21" y2="12" />
			<line x1="3" y1="6" x2="21" y2="6" />
			<line x1="3" y1="18" x2="21" y2="18" />
		</svg>
	);
}

function TrocarIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="mr-2"
			role="img"
			aria-label="Trocar de plano"
		>
			<path d="M5 12h14" />
			<path d="m12 5 7 7-7 7" />
		</svg>
	);
}
