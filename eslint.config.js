import antfu from '@antfu/eslint-config'

export default antfu({}, {
  files: ['tests/**/*.test.mjs'],
  rules: {
    // This project deliberately uses Node's built-in test runner.
    'test/no-import-node-test': 'off',
  },
})
