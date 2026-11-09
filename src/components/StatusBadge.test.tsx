import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
	it("renderiza o rótulo correspondente ao status", () => {
		render(<StatusBadge status="transcribed" />);
		expect(screen.getByText("Transcrição concluída")).toBeTruthy();
	});

	it("renderiza status de erro", () => {
		render(<StatusBadge status="failed_transcription" />);
		expect(screen.getByText("Erro ao transcrever")).toBeTruthy();
	});
});
