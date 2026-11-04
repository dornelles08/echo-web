import logo from "../../../assets/Echo Light 1650x650 - sem fundo.png";

export function Footer() {
	return (
		<footer className="bg-card border-t border-border py-16 px-4">
			<div className="container mx-auto max-w-6xl">
				<div className="grid md:grid-cols-2 gap-12 mb-12">
					<div>
						<img src={logo} alt="Echo" className="h-12 mb-6" />
						<p className="text-muted-foreground leading-relaxed max-w-sm">
							A plataforma inteligente de transcrição que auxilia profissionais
							e equipes a transformar conversas em resultados.
						</p>
					</div>

					<div className="grid grid-cols-2 gap-8">
						<div>
							<h4 className="font-semibold mb-4">Produto</h4>
							<ul className="space-y-3">
								<li>
									<a
										href="/"
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										Transcrição
									</a>
								</li>
								<li>
									<a
										href="/"
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										Resumos IA
									</a>
								</li>
								<li>
									<a
										href="/"
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										Integrações
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Empresa</h4>
							<ul className="space-y-3">
								<li>
									<a
										href="/"
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										Sobre nós
									</a>
								</li>
								<li>
									<a
										href="/"
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										Carreiras
									</a>
								</li>
								<li>
									<a
										href="/"
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										Contato
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-sm text-muted-foreground">
						© {new Date().getFullYear()} Echo. Todos os direitos reservados.
					</p>
					<div className="flex items-center gap-6">
						<a
							href="/"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Política de Privacidade
						</a>
						<a
							href="/"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Termos de Uso
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
