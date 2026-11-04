import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "./_home/-index";

export const Route = createFileRoute("/")({
	component: LandingPage,
});
