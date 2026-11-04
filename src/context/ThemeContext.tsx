import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
	children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
	// Verifica o tema salvo no localStorage ou usa o tema do sistema
	const [theme, setTheme] = useState<Theme>(() => {
		const savedTheme = localStorage.getItem("theme") as Theme;
		if (savedTheme) {
			return savedTheme;
		}

		// Detecta preferência do sistema
		if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			return "dark";
		}

		return "light";
	});

	useEffect(() => {
		const root = window.document.documentElement;

		// Remove a classe anterior
		root.classList.remove("light", "dark");

		// Adiciona a nova classe
		root.classList.add(theme);

		// Salva no localStorage
		localStorage.setItem("theme", theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);

	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
}
