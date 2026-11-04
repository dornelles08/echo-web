import { useId, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface LanguageSelectProps {
	value: string;
	onChange: (value: string) => void;
	error?: string;
}

// Lista de idiomas mais comuns
const COMMON_LANGUAGES = [
	{ code: "pt-BR", name: "Português (Brasil)" },
	{ code: "en-US", name: "English (United States)" },
	{ code: "es-ES", name: "Español (España)" },
	{ code: "fr-FR", name: "Français (France)" },
	{ code: "de-DE", name: "Deutsch (Deutschland)" },
	{ code: "it-IT", name: "Italiano (Italia)" },
	{ code: "pt-PT", name: "Português (Portugal)" },
	{ code: "en-GB", name: "English (United Kingdom)" },
	{ code: "ja-JP", name: "日本語 (日本)" },
	{ code: "zh-CN", name: "中文 (中国)" },
	{ code: "ko-KR", name: "한국어 (대한민국)" },
	{ code: "ru-RU", name: "Русский (Россия)" },
	{ code: "ar-SA", name: "العربية (المملكة العربية السعودية)" },
	{ code: "hi-IN", name: "हिन्दी (भारत)" },
	{ code: "nl-NL", name: "Nederlands (Nederland)" },
	{ code: "sv-SE", name: "Svenska (Sverige)" },
	{ code: "no-NO", name: "Norsk (Norge)" },
	{ code: "da-DK", name: "Dansk (Danmark)" },
	{ code: "fi-FI", name: "Suomi (Suomi)" },
	{ code: "pl-PL", name: "Polski (Polska)" },
	{ code: "tr-TR", name: "Türkçe (Türkiye)" },
	{ code: "el-GR", name: "Ελληνικά (Ελλάδα)" },
	{ code: "he-IL", name: "עברית (ישראל)" },
	{ code: "th-TH", name: "ไทย (ประเทศไทย)" },
	{ code: "vi-VN", name: "Tiếng Việt (Việt Nam)" },
];

export function LanguageSelect({
	value,
	onChange,
	error,
}: LanguageSelectProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	// Filtra idiomas baseados no termo de busca
	const filteredLanguages = useMemo(() => {
		if (!searchTerm.trim()) return COMMON_LANGUAGES;

		const term = searchTerm.toLowerCase();
		return COMMON_LANGUAGES.filter(
			(lang) =>
				lang.name.toLowerCase().includes(term) ||
				lang.code.toLowerCase().includes(term),
		);
	}, [searchTerm]);

	// Encontra o idioma selecionado
	const selectedLanguage = COMMON_LANGUAGES.find((lang) => lang.code === value);

	const handleSelect = (code: string) => {
		onChange(code);
		setIsOpen(false);
		setSearchTerm("");
	};

	const languageSelectId = useId();

	return (
		<div className="space-y-2">
			<Label
				htmlFor={languageSelectId}
				className="text-stone-900 dark:text-white"
			>
				Idioma da Mídia
			</Label>

			<Select
				value={value}
				onValueChange={handleSelect}
				open={isOpen}
				onOpenChange={setIsOpen}
			>
				<SelectTrigger
					className={`w-full ${error ? "border-red-500" : ""}`}
					id={languageSelectId}
				>
					<SelectValue placeholder="Selecione o idioma">
						{selectedLanguage ? (
							<span className="flex items-center gap-2">
								<span className="text-sm text-stone-600 dark:text-stone-400">
									{selectedLanguage.code}
								</span>
								<span>{selectedLanguage.name}</span>
							</span>
						) : (
							"Selecione o idioma"
						)}
					</SelectValue>
				</SelectTrigger>
				<SelectContent className="max-h-80">
					{/* Campo de busca dentro do dropdown */}
					<div className="p-2 border-b border-stone-200 dark:border-stone-700">
						<Input
							placeholder="Buscar idioma..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="text-sm"
							onClick={(e) => e.stopPropagation()}
						/>
					</div>

					{/* Lista de idiomas filtrados */}
					<div className="max-h-60 overflow-y-auto">
						{filteredLanguages.length > 0 ? (
							filteredLanguages.map((lang) => (
								<SelectItem key={lang.code} value={lang.code} className="py-2">
									<div className="flex items-center justify-between w-full">
										<span>{lang.name}</span>
										<span className="text-xs text-stone-500 dark:text-stone-400 ml-2">
											{lang.code}
										</span>
									</div>
								</SelectItem>
							))
						) : (
							<div className="px-3 py-4 text-center text-sm text-stone-500 dark:text-stone-400">
								Nenhum idioma encontrado para "{searchTerm}"
							</div>
						)}
					</div>
				</SelectContent>
			</Select>

			<p className="text-xs text-stone-500 dark:text-stone-400">
				Selecione o idioma principal da mídia para melhor precisão na
				transcrição.
			</p>

			{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
		</div>
	);
}
