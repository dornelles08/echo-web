import { describe, expect, it } from "vitest";

import {
	formatFileSize,
	getAcceptedExtensions,
	validateFileType,
} from "./upload";

function makeFile(name: string, type: string) {
	return new File(["content"], name, { type });
}

describe("validateFileType", () => {
	it("detects supported video files", () => {
		expect(validateFileType(makeFile("video.mp4", "video/mp4"))).toBe("video");
	});

	it("detects supported audio files", () => {
		expect(validateFileType(makeFile("audio.mp3", "audio/mp3"))).toBe("audio");
	});

	it("returns null for unsupported files", () => {
		expect(validateFileType(makeFile("doc.pdf", "application/pdf"))).toBeNull();
	});
});

describe("getAcceptedExtensions", () => {
	it("includes video extensions only when allowed", () => {
		expect(getAcceptedExtensions(false)).not.toContain(".mp4");
		expect(getAcceptedExtensions(true)).toContain(".mp4");
		expect(getAcceptedExtensions(false)).toContain(".mp3");
	});
});

describe("formatFileSize", () => {
	it("formats bytes, megabytes and gigabytes", () => {
		expect(formatFileSize(0)).toBe("0 Bytes");
		expect(formatFileSize(1024)).toBe("1 KB");
		expect(formatFileSize(1024 * 1024)).toBe("1 MB");
		expect(formatFileSize(1024 * 1024 * 1024)).toBe("1 GB");
	});
});
