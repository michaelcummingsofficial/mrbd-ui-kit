import nextPlugin from "@next/eslint-plugin-next";
import type { ESLint } from "eslint";
import tailwindCanonicalClasses from "eslint-plugin-tailwind-canonical-classes";
import { defineConfig, type Config } from "eslint/config";
import baseConfig from "../../eslint.config";

// The plugins publish types looser than their runtime shape; the casts keep tsc's strict
// check happy without changing behavior.
const tailwindCanonicalRecommended = tailwindCanonicalClasses.configs?.["flat/recommended"] as Config[];
const plugins = {
	"@next/next": nextPlugin
} as unknown as Record<string, ESLint.Plugin>;

const eslintConfig = defineConfig([
	...baseConfig,
	...tailwindCanonicalRecommended,
	{
		plugins,
		rules: {
			...nextPlugin.configs.recommended.rules,
			...nextPlugin.configs["core-web-vitals"].rules,
			"tailwind-canonical-classes/tailwind-canonical-classes": [
				"warn",
				{
					cssPath: "./app/globals.css"
				}
			],
			"@next/next/no-img-element": "off"
		}
	}
]);

export default eslintConfig;
