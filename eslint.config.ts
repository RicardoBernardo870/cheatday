import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Base JS
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...js.configs.recommended,
    languageOptions: {
      globals: globals.browser,
    },
  },

  // TypeScript
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,

  // Vue
  ...vue.configs['flat/recommended'],

  // Vue + TS parser
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  // Custom rules (THIS is where quality comes from)
  {
    rules: {
      // 🔥 General
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',

      // 🔥 TypeScript
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'warn',

      // 🔥 Vue
      'vue/multi-word-component-names': 'off', // allow App.vue etc
      'vue/no-unused-vars': 'warn',
      'vue/require-default-prop': 'off',

      // 🔥 Code quality (important)
      'no-unused-vars': 'off', // handled by TS
    },
  },

  // Disable formatting conflicts (Prettier handles formatting)
  prettier,
]);
