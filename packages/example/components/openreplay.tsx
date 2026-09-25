"use client";
import { OPENREPLAY_PROJECT_KEY, isDevelopment } from "@/lib/config";
import { tracker } from "@openreplay/tracker";
import { useEffect, useRef } from "react";

tracker.configure({
	projectKey: OPENREPLAY_PROJECT_KEY
});

export function OpenReplay() {
	const isStarted = useRef(false);
	useEffect(() => {
		if (!isDevelopment && !isStarted.current && typeof window !== "undefined") {
			tracker.start();
			isStarted.current = true;
		}
	}, []);
	return null;
}
