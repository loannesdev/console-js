import js from "@eslint/js";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  {
    languageOptions: { globals: globals.browser },
    rules: {
      semi: ["error", "always"],
    }
  },
];