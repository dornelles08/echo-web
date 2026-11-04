import { describe, expect, it } from "vitest";

import type { UserProfile } from "@/hooks/useAuth";
import { canGenerateSummary, validateDuration } from "./limits";

const plan: UserProfile["plan"] = {
	id: "plan-1",
	name: "Pro",
	price: 79.9,
	description: "Plano Pro",
	monthlyMinutesLimit: 1200,
	allowVideoUpload: true,
	audioRetentionDays: 60,
	videoRetentionDays: 15,
	maxSummaryAttemptsPerMedia: 3,
};

describe("validateDuration", () => {
	it("rejects when the user profile is not available", () => {
		expect(validateDuration(null, 60)).toEqual({
			valid: false,
			message: "Dados do usuário não encontrados",
		});
	});

	it("rejects when there are no minutes left", () => {
		const result = validateDuration({ minutesRemaining: 0 }, 10);

		expect(result.valid).toBe(false);
		expect(result.message).toBe("Limite de minutos excedido");
	});

	it("rounds partial minutes up, mirroring the API rule", () => {
		const result = validateDuration({ minutesRemaining: 1 }, 61);

		expect(result.valid).toBe(false);
		expect(result.message).toContain("Máximo: 1 minutos");
	});

	it("accepts a file that fits in the remaining minutes", () => {
		expect(validateDuration({ minutesRemaining: 30 }, 600)).toEqual({
			valid: true,
		});
	});
});

describe("canGenerateSummary", () => {
	it("blocks when the user profile is not available", () => {
		expect(canGenerateSummary(null, 0)).toEqual({
			canGenerate: false,
			reason: "no_minutes",
		});
	});

	it("blocks when the per-media attempt limit was reached", () => {
		expect(canGenerateSummary({ plan }, 3)).toEqual({
			canGenerate: false,
			reason: "limit_exceeded",
		});
	});

	it("allows generation while attempts remain", () => {
		expect(canGenerateSummary({ plan }, 2)).toEqual({
			canGenerate: true,
			reason: "none",
		});
	});

	it("does not require remaining minutes, since summaries are not billed", () => {
		expect(canGenerateSummary({ plan }, 0)).toEqual({
			canGenerate: true,
			reason: "none",
		});
	});
});
