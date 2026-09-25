import { DisplayRoot } from "mrbd-ui-kit";
import { isMrbdServer } from "mrbd-ui-kit/next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { DesktopShell } from "./desktop-shell";

interface AdaptiveLayoutProps {
	children: ReactNode;
	readmeContent: string;
}

/**
 * Server component that decides the layout at request time:
 * - MRBD hardware → bare DisplayRoot
 * - Iframe embed (desktop preview) → bare DisplayRoot
 * - Desktop browser → full marketing shell with iframe preview
 *
 * Iframe detection uses the standard `Sec-Fetch-Dest` header that
 * browsers send automatically for iframe sub-resource requests.
 */
export async function AdaptiveLayout({ children, readmeContent }: AdaptiveLayoutProps) {
	const isMrbd = await isMrbdServer();
	const h = await headers();
	const isIframeEmbed = h.get("sec-fetch-dest") === "iframe";
	if (isMrbd || isIframeEmbed) {
		return (
			<DisplayRoot>
				<main id="main-content" className="h-full">
					{children}
				</main>
			</DisplayRoot>
		);
	}

	return <DesktopShell readmeContent={readmeContent} />;
}
