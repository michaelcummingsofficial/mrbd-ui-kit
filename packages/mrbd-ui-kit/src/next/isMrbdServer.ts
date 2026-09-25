import { headers } from "next/headers";
import { isMrbd } from "../lib/isMrbd";

/**
 * Detect a Meta Ray-Ban Display device in React Server Components and Server Actions.
 * Uses Next.js `headers()` to read the user agent.
 *
 * @example
 * ```tsx
 * import { isMrbdServer } from 'mrbd-ui-kit/next';
 *
 * export default async function Page() {
 *   const isMrbd = await isMrbdServer();
 *   return isMrbd ? <MRBDLayout /> : <StandardLayout />;
 * }
 * ```
 */
export async function isMrbdServer(): Promise<boolean> {
	const h = await headers();
	return isMrbd(h.get("user-agent") ?? "");
}
