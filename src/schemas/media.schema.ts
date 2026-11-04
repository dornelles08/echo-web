import { z } from "zod";

export const createMediaSchema = z.object({
	filename: z
		.string()
		.min(1, "Nome do arquivo é obrigatório")
		.max(255, "Nome muito longo"),
	file: z
		.instanceof(File)
		.refine((file) => file.size > 0, "Arquivo é obrigatório")
		.refine(
			(file) => file.size <= 500 * 1024 * 1024, // 500MB
			"Arquivo muito grande (máx. 500MB)",
		),
	language: z.string().min(1, "Selecione o idioma da mídia").optional(),
	duration: z.number().optional(),
	tags: z
		.array(z.string())
		.min(1, "Adicione pelo menos uma tag")
		.max(10, "Máximo de 10 tags"),
	prompt: z
		.string()
		.max(500, "Prompt muito longo (máx. 500 caracteres)")
		.optional(),
});

export type CreateMediaFormData = z.infer<typeof createMediaSchema>;
