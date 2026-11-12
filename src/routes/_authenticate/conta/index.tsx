import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CreditCard, RefreshCw, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useAuth";
import { planBadgeMap, planDescriptionsMap } from "@/lib/plan-features";

export const Route = createFileRoute("/_authenticate/conta/")({
	component: ContaPage,
});

function ContaPage() {
	const navigate = useNavigate();
	const { data: user, isLoading, isError } = useProfile();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="flex flex-col items-center gap-4">
					<div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
					<p className="text-muted-foreground">Carregando conta...</p>
				</div>
			</div>
		);
	}

	if (isError || !user) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<p className="text-muted-foreground">Erro ao carregar dados da conta</p>
			</div>
		);
	}

	const minutesRemaining = user.plan.monthlyMinutesLimit - user.minutesUsed;
	const percentage = Math.min(
		(user.minutesUsed / user.plan.monthlyMinutesLimit) * 100,
		100,
	);
	const cycleEnd = new Date(user.cycleEnd);
	const resetDay = cycleEnd.getDate().toString().padStart(2, "0");
	const resetMonth = (cycleEnd.getMonth() + 1).toString().padStart(2, "0");

	return (
		<div className="min-h-full bg-background">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">Minha conta</h1>
					<p className="text-muted-foreground">
						Gerencie seu plano, consumo de minutos e assinatura.
					</p>
				</div>

				{/* Plano atual */}
				<div className="mb-8 rounded-xl border border-border bg-card p-6">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h2 className="text-lg font-semibold">Plano atual</h2>
							<p className="text-sm text-muted-foreground">
								{planDescriptionsMap[user.plan.name] ?? user.plan.name}
							</p>
						</div>
						<span
							className={`rounded-full px-3 py-1 text-xs font-semibold ${
								user.plan.name === "Free"
									? "bg-emerald-100 text-emerald-700"
									: "bg-secondary text-muted-foreground"
							}`}
						>
							{planBadgeMap[user.plan.name] ?? user.plan.name}
						</span>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="rounded-lg border border-border bg-secondary/50 p-4">
							<p className="text-xs text-muted-foreground uppercase tracking-wider">
								Minutos por mês
							</p>
							<p className="text-2xl font-bold">
								{user.plan.monthlyMinutesLimit} min
							</p>
						</div>
						<div className="rounded-lg border border-border bg-secondary/50 p-4">
							<p className="text-xs text-muted-foreground uppercase tracking-wider">
								Upload de vídeo
							</p>
							<p className="text-2xl font-bold">
								{user.plan.allowVideoUpload ? "Liberado" : "Não disponível"}
							</p>
						</div>
					</div>
				</div>

				{/* Consumo do ciclo */}
				<div className="mb-8 rounded-xl border border-border bg-card p-6">
					<h2 className="text-lg font-semibold mb-4">Consumo do ciclo</h2>

					<div className="flex justify-between items-center mb-2">
						<span className="text-sm text-muted-foreground">
							Minutos utilizados
						</span>
						<span className="text-sm font-semibold">
							{user.minutesUsed} min
						</span>
					</div>
					<div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-4">
						<div
							className="h-full bg-emerald-500 rounded-full transition-all duration-300"
							style={{ width: `${percentage}%` }}
						/>
					</div>
					<div className="flex justify-between items-center mb-6">
						<span className="text-sm text-muted-foreground">
							Saldo restante
						</span>
						<span
							className={`text-sm font-medium ${
								minutesRemaining <= 0 ? "text-destructive" : "text-foreground"
							}`}
						>
							{minutesRemaining} min
						</span>
					</div>

					<div className="grid gap-4 sm:grid-cols-2 text-xs">
						<div className="flex items-center gap-2">
							<Timer className="w-4 h-4 text-muted-foreground" />
							<span className="text-muted-foreground">Data de renovação: </span>
							<span className="text-foreground">
								{resetDay}/{resetMonth}
							</span>
						</div>
						<div className="flex items-center gap-2 justify-end">
							<RefreshCw className="w-4 h-4 text-muted-foreground" />
							<span className="text-muted-foreground">
								Ciclo renova automaticamente
							</span>
						</div>
					</div>

					{percentage >= 80 && (
						<div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
							<p className="text-sm text-amber-700 dark:text-amber-300">
								Você já utilizou <strong>{percentage.toFixed(0)}%</strong>
								da franquia deste ciclo. Considere fazer upgrade para evitar
								interrupções.
							</p>
						</div>
					)}
				</div>

				{/* Benefícios disponíveis */}
				<div className="mb-8 rounded-xl border border-border bg-card p-6">
					<h2 className="text-lg font-semibold mb-4">Benefícios disponíveis</h2>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{user.plan.monthlyMinutesLimit > 0 && (
							<div className="rounded-lg border border-border p-4">
								<div className="flex items-center gap-3 mb-2">
									<CreditCard className="w-5 h-5 text-emerald-500" />
									<h3 className="text-sm font-semibold">
										Processamento mensal
									</h3>
								</div>
								<p className="text-sm text-muted-foreground">
									{user.plan.monthlyMinutesLimit} minutos por mês
								</p>
							</div>
						)}
						<div className="rounded-lg border border-border p-4">
							<div className="flex items-center gap-3 mb-2">
								<CreditCard className="w-5 h-5 text-emerald-500" />
								<h3 className="text-sm font-semibold">
									Histórico de transcrições
								</h3>
							</div>
							<p className="text-sm text-muted-foreground">
								Disponível em todos os planos
							</p>
						</div>
						{user.plan.allowVideoUpload && (
							<div className="rounded-lg border border-border p-4">
								<div className="flex items-center gap-3 mb-2">
									<CreditCard className="w-5 h-5 text-emerald-500" />
									<h3 className="text-sm font-semibold">Upload de vídeo</h3>
								</div>
								<p className="text-sm text-muted-foreground">
									Incluído no seu plano
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Trocar de plano - sempre visível */}
				<div className="mb-8 rounded-xl border border-border bg-card p-6">
					<h2 className="text-lg font-semibold mb-4">Trocar de plano</h2>
					<p className="text-sm text-muted-foreground mb-6">
						Mude seu plano a qualquer momento para ter mais minutos de
						processamento e recursos adicionais.
					</p>
					<Button
						onClick={() =>
							navigate({ to: "/plans", search: { plan: undefined } })
						}
						className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
					>
						Ver planos <ArrowRight className="w-4 h-4 ml-2" />
					</Button>
				</div>

				{/* Upgrade CTA (alerta quando saldo baixo) */}
				{(minutesRemaining <= 0 || percentage >= 80) && (
					<div className="rounded-xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/30 p-6">
						<h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
							Precisa de mais minutos?
						</h2>
						<p className="text-sm text-emerald-700 dark:text-emerald-300 mb-4">
							Faça upgrade do seu plano para ter mais minutos de processamento e
							recursos adicionais.
						</p>
						<Button
							onClick={() =>
								navigate({ to: "/plans", search: { plan: undefined } })
							}
							className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
						>
							Ver planos <ArrowRight className="w-4 h-4 ml-2" />
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
