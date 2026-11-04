import { useCallback, useRef, useState } from "react";

export type RecordingStatus = "idle" | "recording" | "paused" | "stopped";

export interface AudioRecorderState {
	status: RecordingStatus;
	duration: number;
	audioUrl: string | null;
	audioBlob: Blob | null;
}

export interface UseAudioRecorder {
	state: AudioRecorderState;
	startRecording: () => Promise<void>;
	stopRecording: () => void;
	pauseRecording: () => void;
	resumeRecording: () => void;
	reset: () => void;
	requestPermission: () => Promise<boolean>;
	isSupported: boolean;
}

export function useAudioRecorder(): UseAudioRecorder {
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunksRef = useRef<Blob[]>([]);
	const streamRef = useRef<MediaStream | null>(null);
	const timerRef = useRef<number | null>(null);

	const [state, setState] = useState<AudioRecorderState>({
		status: "idle",
		duration: 0,
		audioUrl: null,
		audioBlob: null,
	});

	const isSupported =
		typeof window !== "undefined" && "MediaRecorder" in window;

	const clearTimer = useCallback(() => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	const startTimer = useCallback(() => {
		clearTimer();
		setState((prev) => ({ ...prev, duration: 0 }));
		timerRef.current = window.setInterval(() => {
			setState((prev) => ({ ...prev, duration: prev.duration + 1 }));
		}, 1000);
	}, [clearTimer]);

	const resumeTimer = useCallback(() => {
		clearTimer();
		timerRef.current = window.setInterval(() => {
			setState((prev) => ({ ...prev, duration: prev.duration + 1 }));
		}, 1000);
	}, [clearTimer]);

	const requestPermission = useCallback(async (): Promise<boolean> => {
		if (!isSupported) return false;
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			for (const track of stream.getTracks()) {
				track.stop();
			}
			return true;
		} catch {
			return false;
		}
	}, [isSupported]);

	const startRecording = useCallback(async () => {
		if (!isSupported) {
			throw new Error("MediaRecorder not supported");
		}

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			streamRef.current = stream;

			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: "audio/webm;codecs=opus",
			});

			mediaRecorderRef.current = mediaRecorder;
			chunksRef.current = [];

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					chunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				const blob = new Blob(chunksRef.current, { type: "audio/webm" });
				const url = URL.createObjectURL(blob);

				setState((prev) => ({
					...prev,
					status: "stopped",
					audioUrl: url,
					audioBlob: blob,
				}));

				clearTimer();
			};

			mediaRecorder.start(1000);
			setState((prev) => ({ ...prev, status: "recording" }));
			startTimer();
		} catch (error) {
			console.error("Failed to start recording:", error);
			throw error;
		}
	}, [isSupported, clearTimer, startTimer]);

	const stopRecording = useCallback(() => {
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state !== "inactive"
		) {
			mediaRecorderRef.current.stop();
		}

		if (streamRef.current) {
			for (const track of streamRef.current.getTracks()) {
				track.stop();
			}
			streamRef.current = null;
		}
	}, []);

	const pauseRecording = useCallback(() => {
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state === "recording"
		) {
			mediaRecorderRef.current.pause();
			clearTimer();
			setState((prev) => ({ ...prev, status: "paused" }));
		}
	}, [clearTimer]);

	const resumeRecording = useCallback(() => {
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state === "paused"
		) {
			mediaRecorderRef.current.resume();
			resumeTimer();
			setState((prev) => ({ ...prev, status: "recording" }));
		}
	}, [resumeTimer]);

	const reset = useCallback(() => {
		clearTimer();

		if (streamRef.current) {
			for (const track of streamRef.current.getTracks()) {
				track.stop();
			}
			streamRef.current = null;
		}

		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state !== "inactive"
		) {
			mediaRecorderRef.current.stop();
		}

		if (state.audioUrl) {
			URL.revokeObjectURL(state.audioUrl);
		}

		setState({
			status: "idle",
			duration: 0,
			audioUrl: null,
			audioBlob: null,
		});
	}, [clearTimer, state.audioUrl]);

	return {
		state,
		startRecording,
		stopRecording,
		pauseRecording,
		resumeRecording,
		reset,
		requestPermission,
		isSupported,
	};
}
