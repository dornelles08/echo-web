export interface PlanFeature {
	text: string;
	included: boolean;
}

export const planFeaturesMap: Record<string, PlanFeature[]> = {
	Free: [
		{ text: "30 minutos de processamento / mês", included: true },
		{ text: "Upload de áudio", included: true },
		{ text: "Transcrição automática", included: true },
		{ text: "Resumo em Markdown", included: true },
		{ text: "Áudios disponíveis por 7 dias", included: true },
		{ text: "Upload de vídeo", included: false },
		{ text: "Resumo avançado", included: false },
		{ text: "Histórico de textos", included: false },
		{ text: "Suporte prioritário", included: false },
	],
	Starter: [
		{ text: "6 horas de processamento / mês", included: true },
		{ text: "Upload de áudio", included: true },
		{ text: "Transcrição + resumo", included: true },
		{ text: "Áudios disponíveis por 30 dias", included: true },
		{ text: "Histórico de textos sempre disponível", included: true },
		{ text: "Upload de vídeo", included: false },
		{ text: "Resumo avançado", included: false },
		{ text: "Prioridade de processamento", included: false },
		{ text: "Suporte prioritário", included: false },
	],
	Pro: [
		{ text: "20 horas de processamento / mês", included: true },
		{ text: "Upload de áudio e vídeo", included: true },
		{ text: "Transcrição + resumo avançado", included: true },
		{ text: "Áudios por 60 dias", included: true },
		{ text: "Vídeos por 15 dias", included: true },
		{ text: "Prioridade de processamento", included: true },
		{ text: "Histórico de textos sempre disponível", included: true },
		{ text: "Suporte prioritário", included: false },
	],
	Business: [
		{ text: "50 horas de processamento / mês", included: true },
		{ text: "Áudio e vídeo ilimitados dentro do plano", included: true },
		{ text: "Transcrição + resumo profissional", included: true },
		{ text: "Áudios por 6 meses", included: true },
		{ text: "Vídeos por 3 meses", included: true },
		{ text: "Suporte prioritário", included: true },
		{ text: "Prioridade de processamento", included: true },
		{ text: "Histórico de textos sempre disponível", included: true },
	],
};

export const planDescriptionsMap: Record<string, string> = {
	Free: "Ideal para testar",
	Starter: "Para criadores e profissionais",
	Pro: "Para quem trabalha com conteúdo",
	Business: "Para times e empresas",
};

export const planBadgeMap: Record<string, string | null> = {
	Free: "Grátis",
	Starter: null,
	Pro: "Mais popular",
	Business: null,
};

export const planOrderMap: Record<string, number> = {
	Free: 0,
	Starter: 1,
	Pro: 2,
	Business: 3,
};
