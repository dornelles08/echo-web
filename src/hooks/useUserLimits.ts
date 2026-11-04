import { type UserProfile, useProfile } from "@/hooks/useAuth";
import {
	canGenerateSummary as checkSummary,
	validateDuration,
} from "@/lib/limits";

export type UserPlan = UserProfile["plan"];

export type UserLimits = UserProfile;

/**
 * Single source of truth for plan limits on the client: the profile endpoint.
 * Nothing is read from `localStorage` anymore, so the UI always reflects what
 * the API has persisted (minutes used, cycle end, plan).
 */
export function useUserLimits() {
	const { data: user, isLoading, isError } = useProfile();

	const canUpload = !!user && user.minutesRemaining > 0;
	const canUploadVideo = canUpload && user.plan.allowVideoUpload;
	const hasAnyLimit = !!user && user.plan.monthlyMinutesLimit > 0;

	return {
		user: user ?? null,
		isLoading,
		isError,
		canUpload,
		canUploadVideo,
		hasAnyLimit,
		validateDuration: (durationSeconds: number) =>
			validateDuration(user ?? null, durationSeconds),
		canGenerateSummary: (summaryAttempts: number) =>
			checkSummary(user ?? null, summaryAttempts),
	};
}
