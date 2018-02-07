module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    "jest/globals": true
  },
  extends: ['standard', 'standard-jsx'],
  plugins: ['jest']
}
