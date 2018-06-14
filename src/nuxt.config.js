/* eslint import/no-extraneous-dependencies: "off" */
const SentryPlugin = require('@sentry/webpack-plugin');

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'likecoin-button',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' },
    ],
    script: [
      { src: 'https://www.recaptcha.net/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600|Material+Icons' },
    ],
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  plugins: [
    { src: '~/plugins/vuetify' },
    { src: '~/plugins/vue-i18n' },
  ],
  modules: [
    ['@nuxtjs/google-analytics', {
      id: process.env.GA_TRACKING_ID || 'UA-12301-2',
      autoTracking: {
        exception: true,
      },
    }],
    '@nuxtjs/sentry',
  ],
  /*
  ** Build configuration
  */
  buildDir: 'nuxt',
  build: {
    extractCSS: true,
    parallel: true,
    vendor: [
      'axios',
      '~/plugins/vuetify',
    ],
    babel: {
      presets: ({ isServer }) => [
        [
          'vue-app',
          {
            targets: isServer
              ? { node: '6.14.0' }
              : { browsers: ['defaults'] },
          },
        ],
      ],
    },
    /*
    ** Run ESLint on save
    */
    extend(config, { isClient }) {
      if (process.env.RELEASE && process.env.SENTRY_AUTH_TOKEN) {
        if (isClient) config.devtool = '#source-map'; // eslint-disable-line no-param-reassign
        config.plugins.push(new SentryPlugin({
          release: process.env.RELEASE,
          include: ['nuxt/dist'],
          ignore: ['node_modules', 'nuxt/dist/server-bundle.json', 'nuxt/dist/img', 'nuxt/dist'],
          configFile: '.sentryclirc',
        }));
      }
      if (isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|nuxt)/,
        });
      }
    },
  },
};
