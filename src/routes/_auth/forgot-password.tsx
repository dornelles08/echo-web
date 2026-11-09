import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	type ForgotPasswordFormData,
	forgotPasswordSchema,
} from "@/schemas/auth.schema";

export const Route = createFileRoute("/_auth/forgot-password")({
	component: RouteComponent,
});

function RouteComponent() {
	const emailFieldId = useId();
	const [submitted, setSubmitted] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const onSubmit = async () => {
		setSubmitted(true);
	};

	return (
		<>
			<Link
				to="/sign-in"
				search={{ plan: undefined }}
				className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
			>
				<ArrowLeft className="w-4 h-4 mr-2" />
				Voltar para login
			</Link>

			<div className="text-center mb-8">
				<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 mb-4">
					<KeyRound className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
				</div>
				<h1 className="text-2xl font-bold mb-2">Esqueceu sua senha?</h1>
				<p className="text-muted-foreground">
					Digite seu e-mail e enviaremos instruções para redefinir sua senha.
				</p>
			</div>

			{submitted ? (
				<div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
					<CheckCircle2 className="w-5 h-5 shrink-0" />
					Se as instruções de redefinição forem necessárias, você as receberá
					por e-mail.
				</div>
			) : (
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
					<div className="space-y-2">
						<Label htmlFor={emailFieldId} className="text-sm font-medium">
							E-mail
						</Label>
						<Input
							id={emailFieldId}
							type="email"
							placeholder="exemplo@email.com"
							{...register("email")}
							className={`h-12 rounded-xl bg-secondary/50 border-border focus:border-emerald-500 focus:ring-emerald-500/20 transition-all ${
								errors.email
									? "border-destructive focus:border-destructive"
									: ""
							}`}
						/>
						{errors.email && (
							<p className="text-destructive text-xs">{errors.email.message}</p>
						)}
					</div>

					<Button
						type="submit"
						className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white h-12 rounded-xl text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<span className="flex items-center gap-2">
								<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								Enviando...
							</span>
						) : (
							"Enviar instruções"
						)}
					</Button>
				</form>
			)}

			<div className="mt-8 text-center">
				<p className="text-muted-foreground">
					Lembrou a senha?{" "}
					<Link
						to="/sign-in"
						search={{ plan: undefined }}
						className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors"
					>
						Fazer login
					</Link>
				</p>
			</div>
		</>
	);
}
