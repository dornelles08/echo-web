/** biome-ignore-all lint/correctness/useUniqueElementIds: Uso para navegação */
import {
	ChevronLeft,
	ChevronRight,
	FileText,
	Languages,
	Search,
	ShieldCheck,
	Users,
	Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FeatureCard } from "./FeatureCard";

export function Features() {
	return (
		<section id="recursos" className="py-20 px-4 bg-stone-50 dark:bg-stone-900">
			<div className="container mx-auto max-w-6xl">
				<div className="mb-4 text-sm font-semibold text-teal-700 dark:text-teal-500 tracking-wide uppercase">
					RECURSOS PODEROSOS
				</div>

				<div className="flex items-center justify-between mb-12">
					<h2 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-stone-100">
						Tudo o que você precisa para
						<br />
						dominar sua produtividade
					</h2>

					<div className="hidden md:flex items-center gap-2">
						<Button
							variant="outline"
							size="icon"
							className="rounded-full border-stone-300 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
						>
							<ChevronLeft className="w-5 h-5" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="rounded-full border-stone-300 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
						>
							<ChevronRight className="w-5 h-5" />
						</Button>
					</div>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					<FeatureCard
						icon={Languages}
						title="Suporte a 50+ idiomas"
						description="Transcreva áudios em Português, Inglês, Espanhol e mais. Detecção e conversão idiomática automática."
					/>

					<FeatureCard
						icon={Users}
						title="Identificação de Oradores"
						description="Saiba exatamente quem disse o quê com nossa funcionalidade de múltiplos participantes e etiquetas."
					/>

					<FeatureCard
						icon={FileText}
						title="Resumos Executivos"
						description="A IA condensa horas de áudio em parágrafos curtos e claros de pontos-chave levantados na sequência."
					/>

					<FeatureCard
						icon={Search}
						title="Busca Inteligente"
						description="Pesquise palavras-chave ou tudo que foi discutido em suas histórias de áudios e vídeo diretamente por busca."
					/>

					<FeatureCard
						icon={Video}
						title="Integração Direta"
						description="Conecte com Zoom, Google Meet e Microsoft Teams para transcrever reuniões automaticamente."
					/>

					<FeatureCard
						icon={ShieldCheck}
						title="Segurança Blindada"
						description="Seus dados são criptografados de ponta a ponta e baixos não utilizamos nenhum conteúdo para treinamento externo."
					/>
				</div>
			</div>
		</section>
	);
}
