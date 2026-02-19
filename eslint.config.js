import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/tests/**/*.ts', '**/*.spec.ts'],
    ...playwright.configs['flat/recommended'],
  },
  {
    ignores: ['node_modules/', 'playwright-report/', 'test-results/', 'dist/'],
  },
];
