import { zodResolver } from "@hookform/resolvers/zod";
import {
	createFileRoute,
	Link,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister, useSocialLogin } from "@/hooks/useAuth";
import { type RegisterFormData, registerSchema } from "@/schemas/auth.schema";

import { Divider } from "./-components/divider";
import { SocialSignInButtons } from "./-components/social-buttons";

export const Route = createFileRoute("/_auth/sign-up")({
	component: RouteComponent,
	validateSearch: (search: Record<string, unknown>) => ({
		plan: search.plan as string | undefined,
	}),
});

function RouteComponent() {
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const { plan: planId } = useSearch({ from: "/_auth/sign-up" });
	const registerMutation = useRegister();
	const socialLoginMutation = useSocialLogin();

	const passwordFieldsId = useId();
	const emailFieldsId = useId();
	const nameFieldsId = useId();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = async (data: RegisterFormData) => {
		try {
			await registerMutation.mutateAsync(data);
			navigate({ to: "/sign-in", search: { plan: planId } });
		} catch (error) {
			console.error("Erro ao criar conta:", error);
		}
	};

	const handleSocialSignIn = (provider: "google" | "github") => {
		socialLoginMutation.mutate(provider);
	};

	return (
		<>
			<p className="text-center text-muted-foreground mb-8 text-lg">
				Crie sua conta para transcrições inteligentes
			</p>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
				<div className="space-y-2">
					<Label htmlFor={nameFieldsId} className="text-sm font-medium">
						Nome completo
					</Label>
					<Input
						id={nameFieldsId}
						type="text"
						placeholder="Como devemos chamar você?"
						{...register("name")}
						className={`h-12 rounded-xl bg-secondary/50 border-border focus:border-emerald-500 focus:ring-emerald-500/20 transition-all ${
							errors.name ? "border-destructive focus:border-destructive" : ""
						}`}
					/>
					{errors.name && (
						<p className="text-destructive text-xs">{errors.name.message}</p>
					)}
				</div>

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

				{(registerMutation.isError || socialLoginMutation.isError) && (
					<div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm">
						{registerMutation.error instanceof Error
							? registerMutation.error.message
							: socialLoginMutation.error instanceof Error
								? socialLoginMutation.error.message
								: "Erro ao criar conta. Tente novamente."}
					</div>
				)}

				<Button
					type="submit"
					className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white h-12 rounded-xl text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5"
					disabled={isSubmitting || registerMutation.isPending}
				>
					{isSubmitting || registerMutation.isPending ? (
						<span className="flex items-center gap-2">
							<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							Criando conta...
						</span>
					) : (
						<span className="flex items-center gap-2">
							<UserPlus className="w-5 h-5" />
							Criar conta
						</span>
					)}
				</Button>
			</form>

			<Divider />

			<SocialSignInButtons
				onSignIn={handleSocialSignIn}
				isSubmitting={isSubmitting || registerMutation.isPending}
			/>

			<div className="mt-8 text-center">
				<p className="text-muted-foreground">
					Já possui uma conta?{" "}
					<Link
						to="/sign-in"
						search={{ plan: planId }}
						className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors"
					>
						Fazer login
					</Link>
				</p>
			</div>
		</>
	);
}
