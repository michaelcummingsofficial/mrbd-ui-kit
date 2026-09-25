import { AdaptiveLayout } from "@/components/adaptive-layout";
import Providers from "@/components/providers";
import { APP_URL } from "@/lib/config";
import { isMrbdServer } from "mrbd-ui-kit/next";
import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import "./globals.css";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["500", "600", "700"],
	variable: "--font-nunito"
});

export const metadata: Metadata = {
	metadataBase: APP_URL,
	title: {
		default: "mrbd-ui-kit",
		template: "%s | mrbd-ui-kit"
	},
	description: "The easiest way to build an app for Meta Ray-Ban Display",
	keywords: ["meta ray-ban display", "mrbd", "smart glasses", "ui kit", "react components", "spatial navigation", "mrbd-ui-kit"],
	openGraph: {
		title: "mrbd-ui-kit",
		description: "The easiest way to build an app for Meta Ray-Ban Display",
		type: "website",
		siteName: "mrbd-ui-kit"
	},
	twitter: {
		card: "summary_large_image",
		title: "mrbd-ui-kit",
		description: "The easiest way to build an app for Meta Ray-Ban Display"
	},
	other: {
		"mrbd-web-app-capable": "yes"
	}
};

// The glasses want a fixed 600x600 viewport. Phones and desktops get the normal one.
export async function generateViewport(): Promise<Viewport> {
	if (await isMrbdServer()) {
		return { width: 600, height: 600, initialScale: 1, userScalable: false };
	}

	return { width: "device-width", initialScale: 1 };
}

async function getReadmeContent(): Promise<string> {
	try {
		const readmePath = join(process.cwd(), "..", "..", "README.md");
		return await readFile(readmePath, "utf-8");
	} catch {
		return "# mrbd-ui-kit\n\nDocumentation could not be loaded.";
	}
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const readmeContent = await getReadmeContent();
	return (
		<html lang="en" className={`${nunito.variable}`}>
			<body className="bg-black">
				<Providers>
					<AdaptiveLayout readmeContent={readmeContent}>{children}</AdaptiveLayout>
				</Providers>
			</body>
		</html>
	);
}
