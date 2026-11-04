import { Link } from "@tanstack/react-router";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
	return (
		<section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
			<div className="absolute inset-0 -z-10">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/60 via-background to-background dark:from-emerald-950/30 dark:via-background dark:to-background" />
				<div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-emerald-200/20 dark:bg-emerald-800/10 rounded-full blur-3xl animate-pulse-glow" />
				<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-coral-100/20 dark:bg-coral-950/10 rounded-full blur-3xl animate-pulse-glow animation-delay-400" />
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiM1QjVGNTYiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-[0.4] dark:opacity-[0.2]" />
			</div>

			<div className="container mx-auto px-4 md:px-8 max-w-7xl">
				<div className="grid lg:grid-cols-2 gap-16 items-center">
					<div className="max-w-2xl">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-8 opacity-0 animate-fade-in-up">
							<span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
							Transcrição com IA de alta precisão
						</div>

						<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 tracking-tight opacity-0 animate-fade-in-up animation-delay-100">
							Transforme áudio em{" "}
							<span className="relative">
								<span className="relative z-10 text-emerald-700 dark:text-emerald-400 italic">
									inteligência
								</span>
								<svg
									aria-hidden="true"
									className="absolute -bottom-2 left-0 w-full h-3 text-coral/30 -z-0"
									viewBox="0 0 200 12"
									preserveAspectRatio="none"
								>
									<path
										d="M2 8 Q 50 2, 100 9 T 198 6"
										stroke="currentColor"
										strokeWidth="4"
										fill="none"
									/>
								</svg>
							</span>{" "}
							textuelle
						</h1>

						<p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg opacity-0 animate-fade-in-up animation-delay-200">
							Extraia insights de reuniões, aulas e podcasts. Gere resumos
							automáticos e organize conhecimento com a precisão da inteligência
							artificial.
						</p>

						<div className="flex flex-col sm:flex-row items-start gap-5 mb-12 opacity-0 animate-fade-in-up animation-delay-300">
							<Link to="/sign-in" search={{ plan: undefined }}>
								<Button
									size="lg"
									className="bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-8 h-14 rounded-full text-base font-medium group transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25 hover:-translate-y-1"
								>
									Começar agora
									<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
								</Button>
							</Link>
							<Button
								size="lg"
								variant="outline"
								className="border-2 hover:bg-secondary px-8 h-14 rounded-full text-base font-medium transition-all duration-300 hover:-translate-y-1"
							>
								<Play className="mr-2 w-4 h-4" />
								Ver demonstração
							</Button>
						</div>

						<div className="flex items-center gap-8 opacity-0 animate-fade-in-up animation-delay-400">
							<div className="flex -space-x-3">
								{[1, 2, 3, 4].map((i) => (
									<div
										key={i}
										className="w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-700 flex items-center justify-center text-xs font-semibold"
									>
										{String.fromCharCode(64 + i)}
									</div>
								))}
							</div>
							<div>
								<div className="flex items-center gap-1">
									{[1, 2, 3, 4, 5].map((i) => (
										<svg
											key={i}
											aria-hidden="true"
											className="w-4 h-4 text-gold"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									))}
								</div>
								<p className="text-sm text-muted-foreground mt-1">
									<span className="font-semibold text-foreground">4.9/5</span>{" "}
									de 2.000+ avaliações
								</p>
							</div>
						</div>
					</div>

					<div className="relative hidden lg:block opacity-0 animate-fade-in-scale animation-delay-300">
						<div className="relative">
							<div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/20 to-coral-500/20 rounded-3xl blur-2xl" />
							<div className="relative bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
								<div className="flex items-center gap-2 px-5 py-4 bg-secondary/50 border-b border-border">
									<div className="w-3 h-3 rounded-full bg-red-400/80" />
									<div className="w-3 h-3 rounded-full bg-yellow-400/80" />
									<div className="w-3 h-3 rounded-full bg-green-400/80" />
									<div className="ml-4 px-3 py-1 rounded-md bg-secondary text-xs text-muted-foreground">
										echo-transcription
									</div>
								</div>
								<div className="p-6 space-y-4">
									<div className="flex items-start gap-4">
										<div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 flex items-center justify-center">
											<svg
												aria-hidden="true"
												className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={1.5}
													d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
												/>
											</svg>
										</div>
										<div className="flex-1 space-y-2">
											<div className="h-4 bg-muted rounded w-1/3" />
											<div className="h-3 bg-muted/60 rounded w-full" />
											<div className="h-3 bg-muted/60 rounded w-5/6" />
										</div>
										<div className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
											99%
										</div>
									</div>

									<div className="h-px bg-border" />

									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
												<svg
													aria-hidden="true"
													className="w-3 h-3 text-white"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													strokeWidth={3}
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M5 13l4 4L19 7"
													/>
												</svg>
											</div>
											<span className="text-sm text-muted-foreground">
												Transcrição completa
											</span>
										</div>
										<div className="flex items-center gap-2">
											<div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
												<svg
													aria-hidden="true"
													className="w-3 h-3 text-white"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													strokeWidth={3}
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M5 13l4 4L19 7"
													/>
												</svg>
											</div>
											<span className="text-sm text-muted-foreground">
												Identificação de tópicos
											</span>
										</div>
										<div className="flex items-center gap-2">
											<div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
												<svg
													aria-hidden="true"
													className="w-3 h-3 text-white"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													strokeWidth={3}
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M5 13l4 4L19 7"
													/>
												</svg>
											</div>
											<span className="text-sm text-muted-foreground">
												Resumo automático
											</span>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-3 pt-2">
										<div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
											<div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
												2.4k
											</div>
											<div className="text-xs text-muted-foreground">
												palavras
											</div>
										</div>
										<div className="p-4 rounded-xl bg-gradient-to-br from-coral/10 to-coral/5 border border-coral/20">
											<div className="text-2xl font-bold text-coral">4</div>
											<div className="text-xs text-muted-foreground">
												tópicos
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
