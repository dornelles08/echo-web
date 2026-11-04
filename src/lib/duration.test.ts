import { describe, expect, it } from "vitest";

import {
	formatDuration,
	formatDurationCompact,
	parseDuration,
} from "./duration";

describe("formatDuration", () => {
	it("returns an empty string when duration is missing", () => {
		expect(formatDuration()).toBe("");
		expect(formatDuration(0)).toBe("");
	});

	it("formats seconds, minutes and hours", () => {
		expect(formatDuration(30)).toBe("30s");
		expect(formatDuration(90)).toBe("1m 30s");
		expect(formatDuration(3665)).toBe("1h 1m 5s");
		expect(formatDuration(3600)).toBe("1h");
	});

	it("supports compact output", () => {
		expect(formatDurationCompact(3665)).toBe("1:01:05");
		expect(formatDurationCompact(90)).toBe("1:30");
	});
});

describe("parseDuration", () => {
	it("parses readable and digital formats", () => {
		expect(parseDuration("1h 23m 45s")).toBe(5025);
		expect(parseDuration("1:23:45")).toBe(5025);
		expect(parseDuration("23:45")).toBe(1425);
		expect(parseDuration("45s")).toBe(45);
	});
});
