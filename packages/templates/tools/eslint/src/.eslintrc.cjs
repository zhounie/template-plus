module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'airbnb-base',
    'prettier',
    'plugin:import/typescript',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'import/extensions': 0,
    'vue/multi-word-component-names': 0,
    'no-param-reassign': ['error', { props: false }],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    '@typescript-eslint/no-unused-vars': 2,
    'import/no-cycle': 'off',
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true, "optionalDependencies": false, "peerDependencies": false}]
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
}
