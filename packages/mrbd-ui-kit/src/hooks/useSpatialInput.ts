import { useCallback, useEffect, useRef, useState } from "react";
import { isBackNavigationKey } from "../lib/isBackNavigationKey";

export type SpatialInputKey = "up" | "down" | "left" | "right" | "select" | "back";

export interface SpatialInputState {
	/** The key currently being held, or null */
	activeKey: SpatialInputKey | null;
	/** Last key that was pressed (persists after release) */
	lastKey: SpatialInputKey | null;
}

export interface UseSpatialInputOptions {
	onPress?: (key: SpatialInputKey) => void;
	onRelease?: (key: SpatialInputKey) => void;
	disabled?: boolean;
}

const KEY_MAP: Record<string, SpatialInputKey> = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "left",
	ArrowRight: "right",
	Enter: "select"
};

function toSpatialInputKey(event: KeyboardEvent): SpatialInputKey | undefined {
	return KEY_MAP[event.key] ?? (isBackNavigationKey(event) ? "back" : undefined);
}

export function useSpatialInput(options: UseSpatialInputOptions = {}): SpatialInputState {
	const { disabled = false } = options;
	const [state, setState] = useState<SpatialInputState>({
		activeKey: null,
		lastKey: null
	});

	// Callbacks live in a ref so the window listeners attach once instead of on every render.
	const callbacksRef = useRef(options);
	callbacksRef.current = options;

	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		const key = toSpatialInputKey(e);
		if (!key) {
			return;
		}

		// Back is left unclaimed so useBackNavigation and DisplayRoot still see it.
		if (key !== "back") {
			e.preventDefault();
		}

		setState((prev) => ({ activeKey: key, lastKey: key }));
		callbacksRef.current.onPress?.(key);
	}, []);

	const handleKeyUp = useCallback((e: KeyboardEvent) => {
		const key = toSpatialInputKey(e);
		if (!key) {
			return;
		}

		setState((prev) => ({ ...prev, activeKey: null }));
		callbacksRef.current.onRelease?.(key);
	}, []);

	useEffect(() => {
		if (disabled) {
			return;
		}

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [disabled, handleKeyDown, handleKeyUp]);
	return state;
}
