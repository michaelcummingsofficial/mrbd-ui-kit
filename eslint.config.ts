import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import type { ESLint } from "eslint";
import importXPlugin from "eslint-plugin-import-x";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";

// The plugins publish types looser than their runtime shape; the cast keeps tsc's strict
// check happy without changing behavior.
const plugins = {
	"react-hooks": reactHooksPlugin,
	"@typescript-eslint": tsPlugin
} as unknown as Record<string, ESLint.Plugin>;

const eslintConfig = defineConfig([
	{
		plugins
	},
	{
		plugins: {
			"import-x": importXPlugin
		},
		rules: {
			"curly": ["error", "all"],
			"import-x/first": "error",
			"padding-line-between-statements": [
				"error",
				{ blankLine: "never", prev: "*", next: "block-like" },
				{ blankLine: "never", prev: "*", next: "return" },
				{ blankLine: "always", prev: "block-like", next: "*" },
				{ blankLine: "any", prev: "*", next: "function" },
				{ blankLine: "any", prev: "function", next: "*" },
				{ blankLine: "any", prev: "*", next: "export" },
				{ blankLine: "any", prev: "export", next: "*" },
				{ blankLine: "always", prev: "import", next: "*" },
				{ blankLine: "never", prev: "import", next: "import" },
				{ blankLine: "never", prev: "directive", next: "import" }
			]
		}
	},
	{
		files: ["**/*.{ts,tsx,js,jsx}"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaFeatures: { jsx: true }
			}
		}
	},
	globalIgnores(["**/.next/**", "**/dist/**", "**/next-env.d.ts"])
]);

export default eslintConfig;
