import { useNavigate } from "@tanstack/react-router";
import { Check, HelpCircle, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { usePlans } from "@/hooks/usePlans";
import { useSession } from "@/lib/auth-client";
import {
	planBadgeMap,
	planDescriptionsMap,
	planFeaturesMap,
} from "@/lib/plan-features";
import priceFormatter from "@/utils/priceFormatter";

const faqs = [
	{
		question: "Como funciona o processamento?",
		answer:
			"1 hora de áudio ou vídeo = 1 hora de processamento. Cada transcrição consome o tempo total da mídia. O resumo consome um processamento adicional. Os textos gerados ficam sempre disponíveis na sua conta.",
	},
	{
		question: "O que acontece se eu ultrapassar o limite do meu plano?",
		answer:
			"Quando você atingir o limite mensal, você pode fazer upgrade do plano ou aguardar o próximo ciclo.",
	},
	{
		question: "Posso enviar vídeos?",
		answer:
			"Sim, mas apenas a partir do plano Pro. O Echo extrai automaticamente o áudio do vídeo e realiza a transcrição normalmente.",
	},
	{
		question: "Quais formatos de arquivo são suportados?",
		answer:
			"Você pode enviar arquivos de áudio e vídeo comuns como MP3, WAV, M4A, MP4 e MOV. O suporte pode variar conforme o navegador e o tamanho do arquivo.",
	},
	{
		question: "Existe limite de tamanho por arquivo?",
		answer:
			"Sim. O limite depende do seu plano e também de limitações técnicas para garantir estabilidade. Caso o arquivo seja muito grande, recomendamos dividir em partes.",
	},
	{
		question: "Quanto tempo demora para transcrever?",
		answer:
			"Depende do tamanho da mídia e da demanda do sistema. Em geral, áudios curtos levam poucos segundos, e arquivos maiores podem levar alguns minutos.",
	},
];

function FAQItem({
	question,
	answer,
	isOpen,
	onToggle,
}: {
	question: string;
	answer: string;
	isOpen: boolean;
	onToggle: () => void;
}) {
	return (
		<div className="border-b border-border last:border-0">
			<button
				type="button"
				onClick={onToggle}
				className="flex w-full items-center justify-between py-5 text-left hover:bg-secondary/30 transition-colors px-4 -mx-4 rounded-lg"
			>
				<span className="flex items-center gap-3 font-medium">
					<HelpCircle className="size-4 text-muted-foreground" />
					{question}
				</span>
				<span
					className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="m6 9 6 6 6-6" />
					</svg>
				</span>
			</button>
			<div
				className={`overflow-hidden transition-all duration-300 ${
					isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<p className="pb-5 text-sm text-muted-foreground pl-11">{answer}</p>
			</div>
		</div>
	);
}

export function PricingSection() {
	const navigate = useNavigate();
	const plansSectionId = "planos";
	const [openFaq, setOpenFaq] = useState<number | null>(null);
	const { data: plans, isLoading } = usePlans();
	const { data: session } = useSession();
	const isLoggedIn = !!session?.session;

	const sortedPlans = useMemo(
		() =>
			plans
				? [...plans].sort(
						(a, b) => a.monthlyMinutesLimit - b.monthlyMinutesLimit,
					)
				: [],
		[plans],
	);

	const handlePlanClick = (planId: string) => {
		if (isLoggedIn) {
			navigate({ to: "/plans", search: { plan: planId } });
		} else {
			navigate({ to: "/sign-in", search: { plan: planId } });
		}
	};

	if (isLoading) {
		return (
			<section id={plansSectionId} className="py-32 bg-background">
				<div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
					<div className="animate-pulse">
						<div className="h-8 bg-muted rounded w-48 mx-auto mb-4" />
						<div className="h-4 bg-muted rounded w-64 mx-auto" />
					</div>
				</div>
			</section>
		);
	}

	if (!plans) {
		return null;
	}

	return (
		<section
			id={plansSectionId}
			className="py-32 bg-background relative overflow-hidden"
		>
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-3xl" />
				<div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-coral-50/30 dark:bg-coral-950/10 rounded-full blur-3xl" />
			</div>

			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-20 text-center">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm text-muted-foreground mb-6">
						<span className="w-2 h-2 rounded-full bg-emerald-500" />
						Investimento inteligente
					</div>
					<h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
						Planos e Preços
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
						Transforme áudios e vídeos em texto organizado, buscável e resumido.
						Escolha o plano ideal para suas necessidades.
					</p>
				</div>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{sortedPlans.map((plan) => {
						const features = planFeaturesMap[plan.name] || [];
						const badge = planBadgeMap[plan.name];
						const isPopular = plan.name === "Pro";
						const priceFormatted = priceFormatter(plan.price);

						return (
							<div
								key={plan.id}
								className={`relative flex flex-col rounded-2xl p-1 transition-all duration-300 hover:-translate-y-2 ${
									isPopular
										? "bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 shadow-xl shadow-emerald-500/20"
										: "bg-card border border-border hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10"
								}`}
							>
								{badge && (
									<div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
										<div
											className={`rounded-full px-4 py-1.5 text-xs font-semibold shadow-lg ${
												isPopular
													? "bg-white text-emerald-700"
													: "bg-emerald-600 text-white"
											}`}
										>
											{badge}
										</div>
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
											{planDescriptionsMap[plan.name] || plan.description}
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
													isPopular
														? "text-emerald-100"
														: "text-muted-foreground"
												}`}
											>
												/mês
											</span>
										)}
									</div>

									<ul className="mb-6 space-y-3">
										{features.map((feature) => (
											<li
												key={feature.text}
												className="flex items-start gap-2 text-sm"
											>
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
										onClick={() => handlePlanClick(plan.id)}
										variant={isPopular ? "default" : "outline"}
										className={`w-full h-12 rounded-full font-medium transition-all duration-300 ${
											isPopular
												? "bg-white text-emerald-700 hover:bg-emerald-50"
												: "border-2 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700 dark:hover:bg-emerald-950 dark:hover:border-emerald-400"
										}`}
									>
										{plan.price === 0 ? "Começar grátis" : "Assinar"}
									</Button>
								</div>
							</div>
						);
					})}
				</div>

				<div className="mx-auto mt-24 max-w-3xl">
					<h3 className="mb-8 text-center text-2xl font-bold">
						Perguntas Frequentes
					</h3>
					<div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm px-6">
						{faqs.map((faq, index) => (
							<FAQItem
								key={faq.question}
								question={faq.question}
								answer={faq.answer}
								isOpen={openFaq === index}
								onToggle={() => {
									setOpenFaq(openFaq === index ? null : index);
								}}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
