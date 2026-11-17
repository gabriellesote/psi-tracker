// packages/shared/eslint.config.js
import javascriptRules from '@eslint/js';
import typescriptRules from 'typescript-eslint';

export default typescriptRules.config(
  javascriptRules.configs.recommended,
  ...typescriptRules.configs.recommended,
);
