import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
	return (
		<section className="py-32 px-4 relative overflow-hidden">
			<div className="absolute inset-0 -z-10">
				<div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-charcoal dark:from-emerald-950 dark:via-emerald-900 dark:to-background" />
				<div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
				<div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-coral/30 to-transparent" />
				<div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
				<div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-coral/20 rounded-full blur-3xl" />
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-[0.15]" />
			</div>

			<div className="container mx-auto max-w-4xl">
				<div className="relative z-10 text-center">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-emerald-100 text-sm font-medium mb-8">
						<span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
						Não precisa cartão de crédito
					</div>

					<h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
						Pronto para transformar
						<br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-white to-emerald-300">
							conhecimento em ação?
						</span>
					</h2>

					<p className="text-xl text-emerald-100/80 max-w-2xl mx-auto mb-12 leading-relaxed">
						Junte-se a milhares de profissionais que já economizam horas toda
						semana com transcrições precisas e resumos inteligentes.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-5">
						<Link to="/sign-in" search={{ plan: undefined }}>
							<Button
								size="lg"
								className="bg-white hover:bg-emerald-50 text-emerald-900 px-10 h-14 rounded-full text-base font-semibold group transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1"
							>
								Começar Grátis agora
								<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Button>
						</Link>
					</div>

					<p className="text-sm text-emerald-200/60 mt-8">
						14 minutos grátis no primeiro mês • Cancelamento a qualquer momento
					</p>
				</div>
			</div>
		</section>
	);
}
