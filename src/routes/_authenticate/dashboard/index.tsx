import {
	createFileRoute,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { Filter, Plus } from "lucide-react";
import { useState } from "react";

import { Pagination } from "@/components/Pagination";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMedias } from "@/hooks/useMedia";
import { useUserLimits } from "@/hooks/useUserLimits";
import type { Media } from "@/types/media";
import { CreateMediaModal } from "./-components/CreateMediaModal";
import { EmptyStateSection } from "./-components/EmptyStateSection";
import { MediaFilters } from "./-components/MediaFilters";
import { MediaTable } from "./-components/MediaTable";

export const Route = createFileRoute("/_authenticate/dashboard/")({
	component: RouteComponent,
	validateSearch: (search) => dashboardSearchSchema.parse(search),
});

const dashboardSearchSchema = z.object({
	page: z.number().optional().default(1),
	type: z.string().optional(),
	status: z.string().optional(),
	tags: z.string().optional(),
	search: z.string().optional(),
});

import z from "zod";

function RouteComponent() {
	const navigate = useNavigate();
	const search = useSearch({ from: "/_authenticate/dashboard/" });
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [createMediaModalOpen, setCreateMediaModalOpen] = useState(false);
	const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
	const { canUpload, isLoading: isProfileLoading } = useUserLimits();

	const currentPage = (search.page as number) || 1;
	const currentType = search.type as string | undefined;
	const currentStatus = search.status as string | undefined;
	const currentTags = search.tags
		? (search.tags as string).split(",").filter(Boolean)
		: [];

	const { data, isLoading, isError } = useMedias({
		page: currentPage,
		status: currentStatus,
		type: currentType,
		tags: currentTags,
	});

	function handleMediaClick(media: Media) {
		navigate({ to: `/${media.id}` });
	}

	const handlePageChange = (page: number) => {
		navigate({
			to: "/dashboard",
			search: { ...search, page },
		});
	};

	const handleNewMedia = () => {
		if (!canUpload) {
			setUpgradeModalOpen(true);
			return;
		}
		setCreateMediaModalOpen(true);
	};

	const activeFiltersCount = [currentType, currentStatus, currentTags].filter(
		(f) => f && f.length > 0,
	).length;

	if (isLoading || isProfileLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="flex flex-col items-center gap-4">
					<div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
					<p className="text-muted-foreground">Carregando...</p>
				</div>
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="flex items-center justify-center h-64">
				<p className="text-destructive">
					Erro ao carregar mídias. Tente novamente.
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="mb-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold mb-2">Minhas Mídias</h1>
						<p className="text-muted-foreground">
							Gerencie suas gravações e transcrições geradas por IA.
						</p>
					</div>
				</div>
			</div>

			{data.medias.length > 0 && (
				<div className="flex items-center justify-end gap-3 mb-6">
					<Button
						onClick={handleNewMedia}
						className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white gap-2 rounded-xl transition-all duration-300"
					>
						<Plus className="w-4 h-4" />
						Nova mídia
					</Button>

					<Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
						<SheetTrigger asChild>
							<button
								type="button"
								className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-secondary text-sm font-medium transition-all duration-200"
							>
								<Filter className="w-4 h-4" />
								Filtrar
								{activeFiltersCount > 0 && (
									<span className="w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
										{activeFiltersCount}
									</span>
								)}
							</button>
						</SheetTrigger>
						<SheetContent side="right" showCloseButton={false} className="w-96">
							<div className="p-6">
								<MediaFilters onClose={() => setIsFilterOpen(false)} />
							</div>
						</SheetContent>
					</Sheet>
				</div>
			)}

			{data.medias.length === 0 ? (
				<EmptyStateSection
					onOpenCreateMedia={() => setCreateMediaModalOpen(true)}
				/>
			) : (
				<MediaTable medias={data.medias} onMediaClick={handleMediaClick} />
			)}

			{data.medias.length > 0 && (
				<Pagination
					pagination={data.pagination}
					onPageChange={handlePageChange}
				/>
			)}

			<CreateMediaModal
				open={createMediaModalOpen}
				onOpenChange={setCreateMediaModalOpen}
			/>

			<UpgradeModal
				open={upgradeModalOpen}
				onOpenChange={setUpgradeModalOpen}
				reason="limit_exceeded"
			/>
		</>
	);
}
