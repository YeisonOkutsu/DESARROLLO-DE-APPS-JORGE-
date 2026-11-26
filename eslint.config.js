// Configuración de ESLint (equivalente a "ruff check --select E,F,B,S" en Python).
// - js.configs.recommended: errores y errores probables (como F y B de ruff).
// - security.configs.recommended: reglas de seguridad (como S de ruff).
// - Reglas de estilo adicionales (como E de ruff).
const js = require('@eslint/js');
const globals = require('globals');
const security = require('eslint-plugin-security');

module.exports = [
  { ignores: ['node_modules/', 'coverage/'] },
  js.configs.recommended,
  security.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: {
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'max-len': ['error', { code: 100 }],
    },
  },
  {
    files: ['public/**/*.js'],
    languageOptions: { sourceType: 'script', globals: { ...globals.browser } },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: { globals: { ...globals.jest } },
  },
];
