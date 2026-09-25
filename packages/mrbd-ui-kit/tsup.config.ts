import { defineConfig, type Options } from "tsup";

const isWatch = process.argv.includes("--watch");

// Client-side bundle (components + hooks)
const clientConfig: Options = {
	entry: {
		index: "src/index.ts"
	},
	format: ["esm", "cjs"],
	dts: !isWatch, // Skip DTS in watch mode (slow) — run full build for types
	sourcemap: true,
	clean: !isWatch, // Don't wipe dist/ during watch — crashes consuming dev servers
	external: ["react", "react-dom", "next", "next/headers"],
	banner: {
		js: "'use client';"
	}
};

// Server-side bundles (no 'use client' banner)
const serverConfig: Options = {
	entry: {
		"server/index": "src/server/index.ts",
		"next/index": "src/next/index.ts"
	},
	format: ["esm", "cjs"],
	dts: !isWatch,
	sourcemap: true,
	clean: false, // Don't clean — first config already did
	external: ["react", "react-dom", "next", "next/headers"]
};

export default defineConfig([clientConfig, serverConfig]);
