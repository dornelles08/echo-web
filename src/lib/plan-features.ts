export interface PlanFeature {
	text: string;
	included: boolean;
}

export const planFeaturesMap: Record<string, PlanFeature[]> = {
	Free: [
		{ text: "30 minutos de processamento por mês", included: true },
		{ text: "Upload de áudio", included: true },
		{ text: "Upload de vídeo", included: false },
		{ text: "Transcrição automática", included: true },
		{ text: "Até 1 geração de resumo por mídia", included: true },
		{ text: "Modelos predefinidos de resumo", included: true },
		{ text: "Prompt personalizado", included: false },
		{ text: "Regeneração de resumo", included: false },
		{ text: "Histórico de transcrições", included: true },
		{ text: "Prioridade de processamento (padrão)", included: true },
	],
	Starter: [
		{ text: "360 minutos (6 horas) de processamento por mês", included: true },
		{ text: "Upload de áudio", included: true },
		{ text: "Upload de vídeo", included: false },
		{ text: "Transcrição automática", included: true },
		{ text: "Até 1 geração de resumo por mídia", included: true },
		{ text: "Modelos predefinidos de resumo", included: true },
		{ text: "Prompt personalizado", included: false },
		{ text: "Regeneração de resumo", included: false },
		{ text: "Histórico de transcrições", included: true },
		{ text: "Prioridade de processamento (padrão)", included: true },
	],
	Pro: [
		{
			text: "1.200 minutos (20 horas) de processamento por mês",
			included: true,
		},
		{ text: "Upload de áudio e vídeo", included: true },
		{ text: "Transcrição automática", included: true },
		{ text: "Até 3 gerações de resumo por mídia", included: true },
		{ text: "Modelos predefinidos de resumo", included: true },
		{ text: "Prompt personalizado", included: true },
		{ text: "Regeneração de resumo (dentro do limite)", included: true },
		{ text: "Histórico de transcrições", included: true },
		{ text: "Prioridade de processamento (alta)", included: true },
	],
	Business: [
		{
			text: "3.000 minutos (50 horas) de processamento por mês",
			included: true,
		},
		{ text: "Upload de áudio e vídeo", included: true },
		{ text: "Transcrição automática", included: true },
		{ text: "Até 5 gerações de resumo por mídia", included: true },
		{ text: "Modelos predefinidos de resumo", included: true },
		{ text: "Prompt personalizado", included: true },
		{ text: "Regeneração de resumo (dentro do limite)", included: true },
		{ text: "Histórico de transcrições", included: true },
		{ text: "Prioridade de processamento (muito alta)", included: true },
	],
};

export const planDescriptionsMap: Record<string, string> = {
	Free: "Para conhecer o Echo e transcrever conteúdos curtos.",
	Starter: "Para quem utiliza transcrições com frequência.",
	Pro: "Para quem precisa transformar transcrições em informações úteis, com mais controle e personalização.",
	Business:
		"Para usuários com grande volume de conteúdo e necessidade frequente de análise.",
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
