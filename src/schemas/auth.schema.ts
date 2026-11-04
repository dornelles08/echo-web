import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
	password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
	name: z
		.string()
		.min(3, "Nome deve ter no mínimo 3 caracteres")
		.max(100, "Nome muito longo"),
	email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
	password: z
		.string()
		.min(6, "A senha deve ter no mínimo 6 caracteres")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"A senha deve conter letras maiúsculas, minúsculas e números",
		),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
	email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
