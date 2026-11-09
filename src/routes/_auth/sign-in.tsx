import { zodResolver } from "@hookform/resolvers/zod";
import {
	createFileRoute,
	Link,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { CheckCircle2, Eye, EyeOff, LogIn } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin, useSocialLogin } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api-error";
import { type LoginFormData, loginSchema } from "@/schemas/auth.schema";

import { Divider } from "./-components/divider";
import { SocialSignInButtons } from "./-components/social-buttons";

export const Route = createFileRoute("/_auth/sign-in")({
	component: RouteComponent,
	validateSearch: (
		search: Record<string, unknown>,
	): { plan: string | undefined; registered?: boolean } => ({
		plan: search.plan as string | undefined,
		registered:
			search.registered === true || search.registered === "true"
				? true
				: undefined,
	}),
});

function RouteComponent() {
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const { plan: planId, registered } = useSearch({ from: "/_auth/sign-in" });
	const loginMutation = useLogin();
	const socialLoginMutation = useSocialLogin();

	const passwordFieldsId = useId();
	const emailFieldsId = useId();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	async function onSubmit(data: LoginFormData) {
		try {
			await loginMutation.mutateAsync(data);
			if (planId) {
				navigate({ to: "/plans", search: { plan: planId } });
			} else {
				navigate({ to: "/dashboard", search: { page: 1 } });
			}
		} catch (error) {
			console.error("Erro ao fazer login:", error);
		}
	}

	function handleSocialSignIn(provider: "google" | "github") {
		socialLoginMutation.mutate(provider);
	}

	return (
		<>
			{registered && (
				<div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2 mb-6">
					<CheckCircle2 className="w-5 h-5 shrink-0" />
					Conta criada com sucesso! Faça login para continuar.
				</div>
			)}

			<p className="text-center text-muted-foreground mb-8 text-lg">
				Faça login para acessar sua conta
			</p>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
				<div className="space-y-2">
					<Label htmlFor={emailFieldsId} className="text-sm font-medium">
						E-mail
					</Label>
					<Input
						id={emailFieldsId}
						type="email"
						placeholder="exemplo@email.com"
						{...register("email")}
						className={`h-12 rounded-xl bg-secondary/50 border-border focus:border-emerald-500 focus:ring-emerald-500/20 transition-all ${
							errors.email ? "border-destructive focus:border-destructive" : ""
						}`}
					/>
					{errors.email && (
						<p className="text-destructive text-xs">{errors.email.message}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor={passwordFieldsId} className="text-sm font-medium">
						Senha
					</Label>
					<div className="relative">
						<Input
							id={passwordFieldsId}
							type={showPassword ? "text" : "password"}
							placeholder="Mínimo 8 caracteres"
							{...register("password")}
							className={`h-12 rounded-xl bg-secondary/50 border-border pr-12 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all ${
								errors.password
									? "border-destructive focus:border-destructive"
									: ""
							}`}
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
						>
							{showPassword ? (
								<EyeOff className="w-5 h-5" />
							) : (
								<Eye className="w-5 h-5" />
							)}
						</button>
					</div>
					{errors.password && (
						<p className="text-destructive text-xs">
							{errors.password.message}
						</p>
					)}
				</div>

				<div className="text-right">
					<Link
						to="/forgot-password"
						className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
					>
						Esqueci minha senha
					</Link>
				</div>

				{(loginMutation.isError || socialLoginMutation.isError) && (
					<div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm">
						{getApiErrorMessage(
							loginMutation.error ?? socialLoginMutation.error,
							"E-mail ou senha incorretos. Tente novamente.",
						)}
					</div>
				)}

				<Button
					type="submit"
					className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white h-12 rounded-xl text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5"
					disabled={isSubmitting || loginMutation.isPending}
				>
					{isSubmitting || loginMutation.isPending ? (
						<span className="flex items-center gap-2">
							<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							Entrando...
						</span>
					) : (
						<span className="flex items-center gap-2">
							<LogIn className="w-5 h-5" />
							Entrar
						</span>
					)}
				</Button>
			</form>

			<Divider />

			<SocialSignInButtons
				onSignIn={handleSocialSignIn}
				isSubmitting={isSubmitting || socialLoginMutation.isPending}
			/>

			<div className="mt-8 text-center">
				<p className="text-muted-foreground">
					Não tem uma conta?{" "}
					<Link
						to="/sign-up"
						search={{ plan: planId }}
						className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors"
					>
						Criar conta
					</Link>
				</p>
			</div>
		</>
	);
}
