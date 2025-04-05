import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals"; // Often needed for languageOptions

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  // resolvePluginsRelativeTo: __dirname // Might be needed depending on setup
});

// It's often good practice to define language options explicitly
const jsConfig = {
  languageOptions: {
    globals: {
      ...globals.browser, // Or globals.node, etc.
      ...globals.es2021,
    },
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
};

// Your original config fetching Next.js recommended rules
const nextConfig = [
  ...compat.extends("next/core-web-vitals"),
  // Note: next/core-web-vitals often includes TypeScript rules,
  // explicitly adding next/typescript might be redundant depending on the version,
  // but shouldn't hurt. Check Next.js ESLint docs if unsure.
];

// The configuration object to override rules
const ruleOverrides = {
  rules: {
    "@typescript-eslint/no-unused-vars": "off", // Disable the rule completely
    // OR
    // "@typescript-eslint/no-unused-vars": "warn", // Change it to a warning

    // You might also need to disable the base ESLint rule if it's active
    // "no-unused-vars": "off",
  },
};

// Combine the configurations
const eslintConfig = [
  jsConfig, // Apply base JS settings
  ...nextConfig, // Apply Next.js recommended settings
  ruleOverrides, // Apply your specific overrides LAST
];

export default eslintConfig;
