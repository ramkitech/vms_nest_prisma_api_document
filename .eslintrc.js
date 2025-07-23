module.exports = {
  root: true,
  extends: ['next/core-web-vitals'],
  parserOptions: {
    project: './tsconfig.json'
  },
  ignorePatterns: ['dist', 'node_modules'],
  rules: {
    'no-console': 'warn'
  }
};
