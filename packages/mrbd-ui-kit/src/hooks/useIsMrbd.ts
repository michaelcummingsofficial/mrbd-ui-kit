import { useEffect, useState } from "react";
import { isMrbd } from "../lib/isMrbd";

/**
 * Client-side hook to detect if the current device is a Meta Ray-Ban Display.
 * Checks `navigator.userAgent` for the "Greatwhite" token.
 *
 * Returns `false` during SSR. Updates on mount client-side.
 *
 * @example
 * ```tsx
 * const isMrbd = useIsMrbd();
 * return isMrbd ? <DisplayUI /> : <StandardUI />;
 * ```
 */
export function useIsMrbd(): boolean {
	const [isMrbdDevice, setIsMrbdDevice] = useState(false);
	useEffect(() => {
		setIsMrbdDevice(isMrbd(navigator.userAgent));
	}, []);
	return isMrbdDevice;
}
