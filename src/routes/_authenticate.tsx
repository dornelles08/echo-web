import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { Topbar } from "@/components/Topbar";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_authenticate")({
	beforeLoad: async () => {
		const session = await authClient.getSession();

		if (!session.data?.session) {
			throw redirect({ to: "/sign-in", search: { plan: undefined } });
		}
	},
	component: AuthneticateLayout,
});

function AuthneticateLayout() {
	return (
		<div className="h-screen bg-background flex flex-col overflow-hidden">
			<Topbar />

			<main className="flex-1 p-4 md:p-8 overflow-y-auto">
				<div className="max-w-7xl mx-auto h-full">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
