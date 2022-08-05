/* eslint import/no-extraneous-dependencies: "off" */
const { IS_TESTNET } = process.env;

const nuxtConfig = {
  env: {
    SENTRY_DSN: process.env.SENTRY_DSN,
    FACEBOOK_PIXEL_ID: process.env.FACEBOOK_PIXEL_ID,
    IS_TESTNET,
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'LikeCoin - Reinventing the Like',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'With our unique LikeRank algorithm and decentralized Like button, we trace content footprint and reward all creators involved. This is called Proof of Creativity.' },
      { hid: 'og_title', property: 'og:title', content: 'LikeCoin - Reinventing the Like' },
      { hid: 'og_description', property: 'og:description', content: 'With our unique LikeRank algorithm and decentralized Like button, we trace content footprint and reward all creators involved. This is called Proof of Creativity.' },
      { hid: 'og_image', property: 'og:image', content: 'https://button.like.co/images/og/likebutton.png' },
      { hid: 'og_image_alt', property: 'og:image:alt', content: 'LikeCoin' },
      { hid: 'og_image_width', property: 'og:image:width', content: '1200' },
      { hid: 'og_image_height', property: 'og:image:height', content: '630' },
      { hid: 'theme-color', name: 'theme-color', content: '#D2F0F0' },
    ],
    link: [
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'preload', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600|Material+Icons', as: 'style' },
      // {
      //   rel: 'preload',
      //   href: `https://${IS_TESTNET ? 'rinkeby.' : ''}like.co/api/experiments/list`,
      //   as: 'fetch',
      //   crossorigin: 'anonymous',
      // },
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600|Material+Icons' },
    ],
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  plugins: [
    { src: '~/plugins/polyfill', ssr: false },
    { src: '~/plugins/likecoin-ui-vue' },
    { src: '~/plugins/vue-i18n' },
    { src: '~/plugins/gsap.client.js', ssr: false },
    // { src: '~/plugins/optimize.js' },
  ],
  render: {
    csp: {
      enabled: true,
      hashAlgorithm: 'sha256',
      policies: {
        'default-src': [
          "'self'",
          'data:',
          'blob:',
          '*',
        ],
        'script-src': [
          "'self'",
          /* gtm inline code */
          "'sha256-X3ZM8SMe34uV9LglkNh69UN/Vkuo+blzT0E7mN1rUnQ='",
          /* https://github.com/nuxt/nuxt.js/issues/5627 */
          // "'unsafe-inline'", // ignored by browser with sha support
          'www.google-analytics.com',
          'www.googletagmanager.com',
          'www.googleadservices.com',
          'ajax.googleapis.com',
          '*.google.com',
          'www.gstatic.com',
          'www.gstatic.cn',
          'ajax.googleapis.com',
          'js.intercomcdn.com',
          'connect.facebook.net',
          'use.typekit.net',
        ],
        'frame-src': [
          'like.co',
          '*.like.co',
          'www.google.com',
          '*.facebook.com',
          '*.facebook.net',
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
    },
  },
  serverMiddleware: [
    '~/server_middleware/header-listener',
  ],
  modules: [
    ['@nuxtjs/google-tag-manager', {
      id: process.env.GTM_ID || 'GTM-XXXXXXX',
      pageTracking: true,
      respectDoNotTrack: true,
    }],
    '@nuxtjs/sentry',
    'nuxt-svg-loader',
    // '@likecoin/nuxt-google-optimize',
  ],
  sentry: {
    clientIntegrations: {
      /* default integrations will still be added due to deep-merge */
      ReportingObserver: false, // reporting is very noisy on CSP violation.
    },
  },
  // googleOptimize: {
  //   cookieName: '__session',
  //   useFetch: true,
  //   maxAge: 604800, // 1 week
  // },
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    /* BUG: cannot parallel with extractCSS */
    // parallel: true,
    babel: {
      presets: ({ isServer }) => [
        [
          '@nuxt/babel-preset-app',
          {
            targets: isServer
              ? { node: '8.11.1' }
              : { browsers: 'ie 11, > 0.5%, Firefox ESR' },
          },
        ],
      ],
    },
    transpile: ['gsap'],
    /*
    ** Run ESLint on save
    */
    extend(config, { isClient, isDev }) {
      /* eslint-disable no-param-reassign */
      if (isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|nuxt)/,
        });
        if (!isDev) config.devtool = '#source-map';
      }
      /* eslint-enable no-param-reassign */
    },
  },
  /*
  ** Global CSS
  */
  css: [
    { src: '~/assets/css/index.scss', lang: 'scss' },
    { src: '@likecoin/ui-vue/dist/ui-vue.css', lang: 'css' },
  ],
};

/* do not use es6 export since we directly require() it in functions */
module.exports = nuxtConfig; // eslint-disable-line nuxt/no-cjs-in-config
