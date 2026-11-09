import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
	error: unknown;
	reset: () => void;
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
	const message =
		error instanceof Error ? error.message : "Ocorreu um erro inesperado.";

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-6">
			<div className="max-w-md text-center space-y-4">
				<div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
					<AlertTriangle className="w-7 h-7 text-destructive" />
				</div>
				<h1 className="text-xl font-semibold">Algo deu errado</h1>
				<p className="text-sm text-muted-foreground">{message}</p>
				<Button onClick={reset} className="gap-2">
					<RefreshCw className="w-4 h-4" />
					Tentar novamente
				</Button>
			</div>
		</div>
	);
}
