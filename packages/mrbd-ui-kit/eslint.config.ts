import tailwindCanonicalClasses from "eslint-plugin-tailwind-canonical-classes";
import { defineConfig, type Config } from "eslint/config";
import baseConfig from "../../eslint.config";

const tailwindCanonicalRecommended = tailwindCanonicalClasses.configs?.["flat/recommended"] as Config[];

const eslintConfig = defineConfig([
	...baseConfig,
	...tailwindCanonicalRecommended,
	{
		rules: {
			"tailwind-canonical-classes/tailwind-canonical-classes": [
				"warn",
				{
					cssPath: "./src/css/mrbd.css"
				}
			]
		}
	}
]);

export default eslintConfig;
