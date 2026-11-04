import type { UserProfile } from "@/hooks/useAuth";

export type SummaryLimitReason = "no_minutes" | "limit_exceeded" | "none";

export interface DurationValidation {
	valid: boolean;
	message?: string;
}

export interface SummaryPermission {
	canGenerate: boolean;
	reason: SummaryLimitReason;
}

/**
 * Mirrors the API rule: the uploaded file is charged in whole minutes
 * (`Math.ceil(seconds / 60)`), so the same rounding is used here to avoid
 * letting the user start an upload the backend will reject.
 */
export function validateDuration(
	user: Pick<UserProfile, "minutesRemaining"> | null,
	durationSeconds: number,
): DurationValidation {
	if (!user) {
		return { valid: false, message: "Dados do usuário não encontrados" };
	}

	if (user.minutesRemaining <= 0) {
		return { valid: false, message: "Limite de minutos excedido" };
	}

	const durationMinutes = Math.ceil(durationSeconds / 60);

	if (durationMinutes > user.minutesRemaining) {
		return {
			valid: false,
			message: `Arquivo excede seu tempo restante. Máximo: ${Math.floor(user.minutesRemaining)} minutos`,
		};
	}

	return { valid: true };
}

/**
 * Summary generation does not consume minutes in the current API. The only
 * rule is the per-media attempt limit defined by the user's plan.
 */
export function canGenerateSummary(
	user: Pick<UserProfile, "plan"> | null,
	summaryAttempts: number,
): SummaryPermission {
	if (!user) {
		return { canGenerate: false, reason: "no_minutes" };
	}

	if (summaryAttempts >= user.plan.maxSummaryAttemptsPerMedia) {
		return { canGenerate: false, reason: "limit_exceeded" };
	}

	return { canGenerate: true, reason: "none" };
}
