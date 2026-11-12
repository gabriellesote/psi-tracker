// apps/api/eslint.config.js
import javascriptRules from '@eslint/js';
import globals from 'globals';
import typescriptRules from 'typescript-eslint';

export default typescriptRules.config(
  { ignores: ['dist'] },
  javascriptRules.configs.recommended,
  ...typescriptRules.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: { globals: globals.node },
  },
);
