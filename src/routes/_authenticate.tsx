import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { Topbar } from "@/components/Topbar";

export const Route = createFileRoute("/_authenticate")({
	beforeLoad: async () => {
		const token = localStorage.getItem("auth_token");

		if (!token) {
			throw redirect({ to: "/sign-in", search: { plan: undefined } });
		}
	},
	component: AuthneticateLayout,
});

function AuthneticateLayout() {
	return (
		<div className="h-screen bg-background flex flex-col overflow-hidden">
			<Topbar />

			<main className="flex-1 p-4 md:p-8 overflow-hidden">
				<div className="max-w-7xl mx-auto h-full overflow-hidden">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
