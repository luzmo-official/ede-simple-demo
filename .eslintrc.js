module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
  overrides: [
    {
      files: ['**/*.mjs'],
      parserOptions: { sourceType: 'module' },
    },
  ],
};
