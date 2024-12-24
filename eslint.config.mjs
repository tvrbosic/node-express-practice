import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.node } },
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
  },
  pluginJs.configs.recommended,
  eslintPluginPrettier,
  // {
  //   rules: {
  //      ADD CUSTOM RULES
  //   },
  // },
];
