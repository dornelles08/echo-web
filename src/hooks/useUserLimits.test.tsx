import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { UserProfile } from "@/hooks/useAuth";

const profileState: {
	data: UserProfile | undefined;
	isLoading: boolean;
	isError: boolean;
} = {
	data: undefined,
	isLoading: true,
	isError: false,
};

vi.mock("@/hooks/useAuth", () => ({
	useProfile: () => profileState,
}));

const { useUserLimits } = await import("./useUserLimits");

const plan: UserProfile["plan"] = {
	id: "plan-1",
	name: "Free",
	price: 0,
	description: "Ideal para testar",
	monthlyMinutesLimit: 30,
	allowVideoUpload: false,
	audioRetentionDays: 7,
	videoRetentionDays: 0,
	maxSummaryAttemptsPerMedia: 1,
};

function makeProfile(overrides: Partial<UserProfile> = {}): UserProfile {
	return {
		id: "user-1",
		name: "John Doe",
		email: "john@example.com",
		plan,
		minutesUsed: 10,
		minutesRemaining: 20,
		cycleEnd: new Date("2026-12-01T00:00:00.000Z").toISOString(),
		...overrides,
	};
}

describe("useUserLimits", () => {
	beforeEach(() => {
		profileState.data = undefined;
		profileState.isLoading = true;
		profileState.isError = false;
	});

	it("reports loading while the profile request is in flight", () => {
		const { result } = renderHook(() => useUserLimits());

		expect(result.current.isLoading).toBe(true);
		expect(result.current.user).toBeNull();
		expect(result.current.canUpload).toBe(false);
	});

	it("derives limits from the server profile instead of localStorage", () => {
		profileState.data = makeProfile();
		profileState.isLoading = false;

		const { result } = renderHook(() => useUserLimits());

		expect(result.current.user?.minutesRemaining).toBe(20);
		expect(result.current.canUpload).toBe(true);
		expect(result.current.canUploadVideo).toBe(false);
		expect(result.current.hasAnyLimit).toBe(true);
	});

	it("blocks uploads when the plan minutes are exhausted", () => {
		profileState.data = makeProfile({ minutesUsed: 30, minutesRemaining: 0 });
		profileState.isLoading = false;

		const { result } = renderHook(() => useUserLimits());

		expect(result.current.canUpload).toBe(false);
		expect(result.current.validateDuration(60).valid).toBe(false);
	});

	it("allows video upload only when the plan permits it", () => {
		profileState.data = makeProfile({
			plan: { ...plan, allowVideoUpload: true },
		});
		profileState.isLoading = false;

		const { result } = renderHook(() => useUserLimits());

		expect(result.current.canUploadVideo).toBe(true);
	});
});
