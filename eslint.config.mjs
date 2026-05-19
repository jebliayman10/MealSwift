import next from "eslint-config-next";

/**
 * ESLint 9 flat config. `eslint-config-next` v16 already exports a flat
 * config array (next + next/typescript + core-web-vitals), so it is spread
 * directly — no FlatCompat shim.
 */
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "prisma/migrations/**",
      "scripts/**",
      "next-env.d.ts",
    ],
  },
  ...next,
];

export default eslintConfig;
