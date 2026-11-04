import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export interface SummaryTemplate {
	id: string;
	label: string;
	description: string;
	prompt: string;
}

export function useSummaryTemplates() {
	return useQuery({
		queryKey: ["summary-templates"],
		queryFn: async (): Promise<SummaryTemplate[]> => {
			const response = await api.get("/summary-templates");
			return response.data.templates;
		},
	});
}
