import { Moon, Plus, Sun } from "lucide-react";
import { useState } from "react";

import { UpgradeModal } from "@/components/UpgradeModal";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { useUserLimits } from "@/hooks/useUserLimits";
import { CreateMediaModal } from "./CreateMediaModal";

export function Header() {
	const { theme, toggleTheme } = useTheme();
	const [createMediaModalOpen, setCreateMediaModalOpen] = useState(false);
	const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
	const { canUpload } = useUserLimits();

	const handleNewMedia = () => {
		if (!canUpload) {
			setUpgradeModalOpen(true);
			return;
		}
		setCreateMediaModalOpen(true);
	};

	return (
		<header className="h-16 border-b border-border bg-card px-8 flex items-center justify-between">
			<div className="flex-1 max-w-xl" />

			<div className="flex items-center gap-3">
				<button
					onClick={toggleTheme}
					className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
					aria-label="Alternar tema"
					type="button"
				>
					{theme === "light" ? (
						<Moon className="w-5 h-5" />
					) : (
						<Sun className="w-5 h-5" />
					)}
				</button>

				<Button
					onClick={handleNewMedia}
					className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white gap-2 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
				>
					<Plus className="w-4 h-4" />
					Nova mídia
				</Button>
			</div>

			<CreateMediaModal
				open={createMediaModalOpen}
				onOpenChange={setCreateMediaModalOpen}
			/>

			<UpgradeModal
				open={upgradeModalOpen}
				onOpenChange={setUpgradeModalOpen}
				reason="limit_exceeded"
			/>
		</header>
	);
}
