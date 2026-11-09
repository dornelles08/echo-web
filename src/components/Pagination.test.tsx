import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
	it("exibe contagem e desabilita anterior na primeira página", () => {
		const onPageChange = vi.fn();
		render(
			<Pagination
				pagination={{ page: 1, totalPages: 3, total: 25, perPage: 10 }}
				onPageChange={onPageChange}
			/>,
		);

		expect(screen.getByText(/Mostrando 1 a 10 de 25/)).toBeTruthy();
		const prev = screen
			.getAllByRole("button")
			.find((b) => /Anterior/.test(b.textContent || ""));
		expect((prev as HTMLButtonElement).disabled).toBe(true);
	});

	it("habilita próximo quando há mais páginas", () => {
		const onPageChange = vi.fn();
		render(
			<Pagination
				pagination={{ page: 1, totalPages: 3, total: 25, perPage: 10 }}
				onPageChange={onPageChange}
			/>,
		);

		const next = screen
			.getAllByRole("button")
			.find((b) => /Próximo/.test(b.textContent || ""));
		expect((next as HTMLButtonElement).disabled).toBe(false);
	});
});
