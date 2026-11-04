import { FileDown, Sparkles, Upload } from "lucide-react";

export function HowItWorks() {
	return (
		// biome-ignore lint/correctness/useUniqueElementIds: anchor navigation
		<section
			id="funciona"
			className="py-32 px-4 bg-secondary/30 dark:bg-secondary/10 relative overflow-hidden"
		>
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-emerald-200/20 dark:bg-emerald-800/10 rounded-full blur-3xl" />
				<div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-coral-100/20 dark:bg-coral-950/10 rounded-full blur-3xl" />
			</div>

			<div className="container mx-auto max-w-6xl">
				<div className="text-center mb-20">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm text-muted-foreground mb-6">
						<Sparkles className="w-4 h-4 text-emerald-500" />
						Processo simplificado
					</div>
					<h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
						Como o Echo funciona
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
						Um processo elegante e eficiente para transformar suas gravações em
						conhecimento estruturado.
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8 relative">
					<div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent hidden md:block -translate-y-1/2" />

					<div className="relative group">
						<div className="absolute -inset-2 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
						<div className="relative bg-card rounded-2xl p-8 border border-border hover:border-emerald-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/10">
							<div className="absolute -top-5 left-8">
								<div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-emerald-500/30">
									1
								</div>
							</div>

							<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
								<Upload className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
							</div>

							<h3 className="text-xl font-bold mb-3">Upload</h3>
							<p className="text-muted-foreground leading-relaxed">
								Envie seus arquivos de áudio ou vídeo para a nuvem. Suportamos
								MP3, MP4, WAV e muitos outros formatos.
							</p>
						</div>
					</div>

					<div className="relative group">
						<div className="absolute -inset-2 bg-gradient-to-br from-coral/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
						<div className="relative bg-card rounded-2xl p-8 border border-border hover:border-coral/30 transition-all duration-500 hover:shadow-xl hover:shadow-coral/10">
							<div className="absolute -top-5 left-8">
								<div className="w-10 h-10 rounded-full bg-coral text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-coral/30">
									2
								</div>
							</div>

							<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coral/20 to-coral/10 dark:from-coral/20 dark:to-coral/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
								<Sparkles className="w-8 h-8 text-coral" />
							</div>

							<h3 className="text-xl font-bold mb-3">IA Processamento</h3>
							<p className="text-muted-foreground leading-relaxed">
								Nossa IA trabalha com 99% de precisão e identifica os principais
								tópicos e palavras-chave automaticamente.
							</p>
						</div>
					</div>

					<div className="relative group">
						<div className="absolute -inset-2 bg-gradient-to-br from-gold/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
						<div className="relative bg-card rounded-2xl p-8 border border-border hover:border-gold/30 transition-all duration-500 hover:shadow-xl hover:shadow-gold/10">
							<div className="absolute -top-5 left-8">
								<div className="w-10 h-10 rounded-full bg-gold text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-gold/30">
									3
								</div>
							</div>

							<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
								<FileDown className="w-8 h-8 text-gold" />
							</div>

							<h3 className="text-xl font-bold mb-3">Insight e Export</h3>
							<p className="text-muted-foreground leading-relaxed">
								Acesse seu texto inteligente, pontos principais e exporte em PDF
								ou Markdown.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
