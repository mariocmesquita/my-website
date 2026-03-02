import { config } from '@my-website/eslint-config/react-internal';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  { rules: { 'turbo/no-undeclared-env-vars': 'off' } },
];
