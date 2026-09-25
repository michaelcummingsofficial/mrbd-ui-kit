"use client";
import { isDevelopment } from "@/lib/config";
import { Analytics } from "@vercel/analytics/next";
import { OpenReplay } from "./openreplay";

export default function Providers({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			{!isDevelopment && (
				<>
					<OpenReplay />
					<Analytics />
				</>
			)}
			{children}
		</>
	);
}
