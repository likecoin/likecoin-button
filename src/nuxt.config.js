/* eslint import/no-extraneous-dependencies: "off" */
const path = require('path');

const { IS_TESTNET } = process.env;

const nuxtConfig = {
  env: {
    SENTRY_DSN: process.env.SENTRY_DSN,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    IS_TESTNET,
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'LikeCoin Widget By LikerLand',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Decentralize Publishing. Own your content forever.' },
      { hid: 'og:title', property: 'og:title', content: 'LikeCoin Widget By LikerLand' },
      { hid: 'og:description', property: 'og:description', content: 'Decentralize Publishing. Own your content forever.' },
      { hid: 'og:image', property: 'og:image', content: 'https://button.like.co/images/og/likebutton.png' },
      { hid: 'og:image:alt', property: 'og:image:alt', content: 'LikeCoin' },
      { hid: 'og:image:width', property: 'og:image:width', content: '1200' },
      { hid: 'og:image:height', property: 'og:image:height', content: '630' },
      { hid: 'theme-color', name: 'theme-color', content: '#D2F0F0' },
      { hid: 'robots', name: 'robots', content: 'noindex, indexifembedded' },
    ],
    link: [
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'preload', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600|Material+Icons', as: 'style' },
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600|Material+Icons' },
    ],
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  components: true,
  plugins: [
    { src: '~/plugins/polyfill', ssr: false },
    { src: '~/plugins/likecoin-ui-vue' },
    { src: '~/plugins/vue-i18n' },
    { src: '~/plugins/gsap.client.js', ssr: false },
    { src: '~/plugins/gtag.client.js', ssr: false },
  ],
  render: {
    csp: {
      enabled: true,
      hashAlgorithm: 'sha256',
      unsafeInlineCompatibility: true,
      policies: {
        'default-src': [
          "'self'",
          'data:',
          'blob:',
          '*',
        ],
        'script-src': [
          "'self'",
          "'unsafe-inline'", // ignored by browser with sha support
          "'wasm-unsafe-eval'",
          'www.google-analytics.com',
          'www.googletagmanager.com',
          'use.typekit.net',
        ],
        'frame-src': [
          'like.co',
          '*.like.co',
          'www.google.com',
        ],
        'connect-src': [
          "'self'",
          'data:',
          '*',
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          'fonts.googleapis.com',
        ],
      },
    },
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'in-embed-id-button-preview',
        path: '/in/embed/:id/button/preview',
        component: resolve(__dirname, 'pages/in/embed/_id/button.vue'),
      });
      routes.push({
        name: 'in-embed-id-button-amount',
        path: '/in/embed/:id/button/:amount?',
        component: resolve(__dirname, 'pages/in/embed/_id/button.vue'),
      });
      routes.push({
        name: 'id-done',
        path: '/:id/done',
        component: resolve(__dirname, 'pages/_id/index.vue'),
      });
      routes.push({
        name: 'in-nft-id',
        path: '/in/nft/:id?',
        component: resolve(__dirname, 'pages/nft/_id.vue'),
      });
    },
  },
  modules: [
    '@nuxtjs/sentry',
    'nuxt-svg-loader',
  ],
  buildModules: [
    '@nuxtjs/tailwindcss',
  ],
  sentry: {
    config: {
      ignoreErrors: [
        'Unable to get property \'matched\' of undefined or null reference',
        '未指定的錯誤',
        'Unspecified error',
        'WebAssembly.instantiate',
        'WebAssembly Instantiation',
        'Refused to create a WebAssembly object',
      ],
    },
    clientIntegrations: {
      /* default integrations will still be added due to deep-merge */
      ReportingObserver: false, // reporting is very noisy on CSP violation.
    },
  },
  /*
  ** Build configuration
  */
  build: {
    babel: {
      presets: ({ isServer }) => [
        [
          '@nuxt/babel-preset-app',
          {
            targets: isServer
              ? { node: '18' }
              : { browsers: 'ie 11, > 0.5%, Firefox ESR' },
          },
        ],
      ],
    },
    transpile: [
      'gsap',
      ({ isLegacy }) => isLegacy && 'axios',
    ],
    /*
    ** Run ESLint on save
    */
    extend(config, ctx) {
      /* eslint-disable no-param-reassign */
      if (ctx.isClient) {
        if (ctx.isDev) {
          config.module.rules.push({
            enforce: 'pre',
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            exclude: /(node_modules)||(.svg$)/,
          });
        } else {
          config.devtool = 'source-map';
        }
      }
      if (!ctx.isDev) {
        config.resolve.alias['bn.js'] = path.join(__dirname, './node_modules/bn.js');
      }
      /* eslint-enable no-param-reassign */
    },
  },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/index.scss',
    '@likecoin/ui-vue/dist/ui-vue.css',
  ],
};

/* do not use es6 export since we directly require() it in functions */
module.exports = nuxtConfig;
