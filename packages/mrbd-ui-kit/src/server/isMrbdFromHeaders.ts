import { isMrbd } from "../lib/isMrbd";

/**
 * Check a Headers object for a Meta Ray-Ban Display device. Works in any server runtime.
 *
 * @example
 * ```ts
 * import { isMrbdFromHeaders } from 'mrbd-ui-kit/server';
 *
 * export async function GET(request: Request) {
 *   if (isMrbdFromHeaders(request.headers)) {
 *     return Response.json({ display: 'mrbd' });
 *   }
 * }
 * ```
 */
export function isMrbdFromHeaders(headers: Headers): boolean {
	return isMrbd(headers.get("user-agent") ?? "");
}
