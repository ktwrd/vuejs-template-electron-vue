module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
    {{#if_eq eslintConfig 'dariox'}}
    ecmaFeatures: {
      classes: true
    }
    {{/if_eq}}
  },
  env: {
    browser: true,
    node: true
  },
  {{#if_eq eslintConfig 'standard'}}
  extends: 'standard',
  {{/if_eq}}
  {{#if_eq eslintConfig 'airbnb'}}
  extends: 'airbnb-base',
  {{/if_eq}}
  {{#if_eq eslintConfig 'dariox'}}
  extends: 'dariox',
  {{/if_eq}}
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  'rules': {
    {{#if_eq eslintConfig 'standard'}}
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    {{/if_eq}}
    {{#if_eq eslintConfig 'airbnb'}}
    'global-require': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'import/extensions': 0,
    'import/newline-after-import': 0,
    'no-multi-assign': 0,
    {{/if_eq}}
    {{#if_eq eslintConfig 'dariox'}}
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-trailing-spaces': 0,
    'eqeqeq': 0,
    'no-useless-escape': 0,
    'no-unused-vars': 0,
    'curly': 0,
    'no-undef': 0,
    'new-cap': 0,
    'no-restricted-imports': 2,
    'no-global-assign': 0,
    'no-shadow-restricted-names': 0
    {{/if_eq}}
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
