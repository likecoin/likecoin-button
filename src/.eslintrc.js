module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'airbnb-base',
    '@nuxtjs',
    'plugin:vue/recommended',
    'plugin:nuxt/recommended',
  ],
  // add your custom rules here
  rules: {
    semi: 'off',
    'comma-dangle': [
      'error', {
        arrays: 'only-multiline',
        objects: 'only-multiline',
        imports: 'only-multiline',
        exports: 'only-multiline',
        functions: 'ignore'
      },
    ],
    'no-console': 'warn',
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      mjs: 'never',
      vue: 'never'
    }],
    'vue/attributes-order': [
      'error',
      {
        order: [
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          'UNIQUE',
          'BINDING',
          'DEFINITION',
          'OTHER_ATTR',
          'CONTENT',
          'EVENTS',
        ],
      },
    ],
    'vue/name-property-casing': ['error', 'kebab-case'],
    'vue/attribute-hyphenation': 'off',
    'vue/html-indent': ['error'],
    'vue/html-closing-bracket-newline': ['error', { multiline: 'always' }],
    'vue/html-closing-bracket-spacing': ['error'],
    'vue/multiline-html-element-content-newline': 'off',
    'vue/singleline-html-element-content-newline': 'off',
  },
  globals: {},
  settings: {
    'import/resolver': {
      webpack: 'webpack.config.js',
    },
  },
};
