/**
 * Formata duração em segundos para formato legível (Xh Xm Xs)
 *
 * @param seconds - Duração em segundos
 * @param options - Opções de formatação
 * @returns String formatada (ex: "1h 23m 45s", "45m 30s", "30s")
 *
 * @example
 * formatDuration(30) // "30s"
 * formatDuration(90) // "1m 30s"
 * formatDuration(3665) // "1h 1m 5s"
 * formatDuration(3600) // "1h"
 * formatDuration(3661, { alwaysShowMinutes: true }) // "1h 1m 1s"
 */
export function formatDuration(
	seconds?: number,
	options: {
		alwaysShowMinutes?: boolean;
		alwaysShowSeconds?: boolean;
		compact?: boolean; // Se true, usa formato compacto: "1:23:45"
	} = {},
): string {
	const {
		alwaysShowMinutes = false,
		alwaysShowSeconds = false,
		compact = false,
	} = options;

	if (!seconds) return "";

	// Garante que não seja negativo
	const totalSeconds = Math.max(0, Math.floor(seconds));

	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const secs = totalSeconds % 60;

	// Formato compacto (digital): "1:23:45" ou "23:45" ou "0:45"
	if (compact) {
		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
		}
		return `${minutes}:${secs.toString().padStart(2, "0")}`;
	}

	// Formato legível: "1h 23m 45s"
	const parts: string[] = [];

	if (hours > 0) {
		parts.push(`${hours}h`);
	}

	if (minutes > 0 || (alwaysShowMinutes && hours > 0)) {
		parts.push(`${minutes}m`);
	}

	if (secs > 0 || alwaysShowSeconds || parts.length === 0) {
		parts.push(`${secs}s`);
	}

	return parts.join(" ");
}

/**
 * Formata duração para exibição em tabelas (formato compacto)
 *
 * @example
 * formatDurationCompact(3665) // "1:01:05"
 * formatDurationCompact(90) // "1:30"
 * formatDurationCompact(30) // "0:30"
 */
export function formatDurationCompact(seconds: number): string {
	return formatDuration(seconds, { compact: true });
}

/**
 * Converte string de duração para segundos
 * Aceita formatos: "1h 23m 45s", "1:23:45", "23:45", "45s"
 *
 * @example
 * parseDuration("1h 23m 45s") // 5025
 * parseDuration("1:23:45") // 5025
 * parseDuration("23:45") // 1425
 * parseDuration("45s") // 45
 */
export function parseDuration(duration: string): number {
	// Formato "1h 23m 45s"
	const readable = duration.match(/(?:(\d+)h)?(?:\s*(\d+)m)?(?:\s*(\d+)s)?/);
	if (readable && (readable[1] || readable[2] || readable[3])) {
		const hours = parseInt(readable[1] || "0", 10);
		const minutes = parseInt(readable[2] || "0", 10);
		const seconds = parseInt(readable[3] || "0", 10);
		return hours * 3600 + minutes * 60 + seconds;
	}

	// Formato "1:23:45" ou "23:45"
	const parts = duration.split(":").map(Number);
	if (parts.length === 3) {
		const h = parts[0] ?? 0;
		const m = parts[1] ?? 0;
		const s = parts[2] ?? 0;
		return h * 3600 + m * 60 + s;
	}
	if (parts.length === 2) {
		const m = parts[0] ?? 0;
		const s = parts[1] ?? 0;
		return m * 60 + s;
	}
	if (parts.length === 1) {
		return parts[0] ?? 0;
	}

	return 0;
}

/**
 * Converte segundos para formato de tempo legível por humanos
 * Útil para descrições mais naturais
 *
 * @example
 * formatDurationHuman(30) // "30 segundos"
 * formatDurationHuman(90) // "1 minuto e 30 segundos"
 * formatDurationHuman(3665) // "1 hora, 1 minuto e 5 segundos"
 */
export function formatDurationHuman(seconds: number): string {
	const totalSeconds = Math.max(0, Math.floor(seconds));

	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const secs = totalSeconds % 60;

	const parts: string[] = [];

	if (hours > 0) {
		parts.push(`${hours} ${hours === 1 ? "hora" : "horas"}`);
	}

	if (minutes > 0) {
		parts.push(`${minutes} ${minutes === 1 ? "minuto" : "minutos"}`);
	}

	if (secs > 0 || parts.length === 0) {
		parts.push(`${secs} ${secs === 1 ? "segundo" : "segundos"}`);
	}

	if (parts.length === 1) return parts[0] ?? "";
	if (parts.length === 2) return parts.join(" e ");
	const lastPart = parts.at(-1);
	const firstParts = parts.slice(0, -1);
	return (
		(firstParts.length > 0 ? `${firstParts.join(", ")} e ` : "") +
		(lastPart ?? "")
	);
}
