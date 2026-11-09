import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useState,
} from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
	id: number;
	message: string;
	type: ToastType;
}

interface ToastContextValue {
	toasts: Toast[];
	showToast: (message: string, type?: ToastType) => void;
	dismissToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let toastCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const dismissToast = useCallback((id: number) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const showToast = useCallback(
		(message: string, type: ToastType = "info") => {
			const id = ++toastCounter;
			setToasts((prev) => [...prev, { id, message, type }]);
			window.setTimeout(() => dismissToast(id), 4000);
		},
		[dismissToast],
	);

	return (
		<ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
			{children}
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (context === undefined) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}

const typeClasses: Record<ToastType, string> = {
	success: "bg-emerald-600 text-white border-emerald-700",
	error: "bg-destructive text-destructive-foreground border-destructive",
	info: "bg-card text-foreground border-border",
	warning: "bg-amber-500 text-white border-amber-600",
};

export function Toaster() {
	const { toasts, dismissToast } = useToast();
	return (
		<div
			aria-live="polite"
			className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
		>
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg animate-in fade-in slide-in-from-bottom-2 ${typeClasses[toast.type]}`}
				>
					<p className="text-sm flex-1">{toast.message}</p>
					<button
						type="button"
						onClick={() => dismissToast(toast.id)}
						aria-label="Fechar notificação"
						className="shrink-0 opacity-80 hover:opacity-100"
					>
						×
					</button>
				</div>
			))}
		</div>
	);
}
