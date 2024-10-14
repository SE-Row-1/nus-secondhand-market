import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier";

const compat = new FlatCompat();

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...fixupConfigRules(
    compat.extends("next/core-web-vitals", "next/typescript"),
  ),
  prettier,
  { ignores: [".next/", "coverage/"] },
];

export default config;
