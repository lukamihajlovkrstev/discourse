import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      indent: 'off',
      quotes: 'off',
      semi: 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-shadow': 'error',
      'no-use-before-define': ['error', { functions: false }],
      'consistent-return': 'error',
      'no-unreachable': 'error',
      'no-fallthrough': 'error',
      'default-case': 'error',
      'require-await': 'error',
      'no-async-promise-executor': 'error',
      'no-return-await': 'error',
      'no-throw-literal': 'error',
      'no-ex-assign': 'error',
      'no-process-exit': 'error',
      'no-sync': 'warn',
      'no-console': 'off',
    },
  },
];
