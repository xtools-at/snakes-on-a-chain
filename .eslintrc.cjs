module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'import/order': 'off',
    'import/extensions': 'off',
    'arrow-body-style': 'off',
    'no-plusplus': 'off',
    semi: 'off',
  },
}
