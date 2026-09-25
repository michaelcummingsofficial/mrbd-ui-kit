const MRBD_UA_TOKEN = "Greatwhite";

/**
 * Check a raw user agent string for a Meta Ray-Ban Display device.
 *
 * @example
 * ```ts
 * import { isMrbd } from 'mrbd-ui-kit/server';
 *
 * const ua = request.headers.get('user-agent') ?? '';
 * if (isMrbd(ua)) {
 *   // Serve MRBD-optimized response
 * }
 * ```
 */
export function isMrbd(userAgent: string): boolean {
	return userAgent.includes(MRBD_UA_TOKEN);
}
