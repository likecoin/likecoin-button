/* eslint import/no-extraneous-dependencies: "off" */

module.exports = {
  env: {
    SENTRY_DSN: process.env.SENTRY_DSN,
    IS_TESTNET: process.env.IS_TESTNET,
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
    script: [
      { src: 'https://www.recaptcha.net/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600|Material+Icons' },
    ],
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  plugins: [
    { src: '~/plugins/vuetify' },
    { src: '~/plugins/vue-simple-svg' },
    { src: '~/plugins/vue-i18n' },
  ],
  render: {
    csp: {
      enabled: true,
      hashAlgorithm: 'sha256',
      policies: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          /* gtm inline code */
          "'sha256-X3ZM8SMe34uV9LglkNh69UN/Vkuo+blzT0E7mN1rUnQ='",
          'https://www.google-analytics.com',
          'https://www.googletagmanager.com',
          'https://www.googleadservices.com',
          'https://cdn.mouseflow.com',
          'https://ajax.googleapis.com',
          'https://*.google.com',
          'https://recaptcha.net',
          'https://www.recaptcha.net',
          'https://www.gstatic.com/',
          'https://www.gstatic.cn/',
          'https://cdn.mouseflow.com',
          'https://ajax.googleapis.com',
          'https://js.intercomcdn.com',
          'https://widget.intercom.io',
          'https://connect.facebook.net',
          'https://use.typekit.net',
          'https://*.intercom.io',
        ],
        'font-src': [
          "'self'",
          'data:',
          'https://fonts.gstatic.com',
          'https://fonts.googleapis.com',
          'https://use.typekit.net',
          'https://js.intercomcdn.com',
        ],
        'frame-src': [
          'https://www.google.com/',
          'https://recaptcha.net',
          'https://www.recaptcha.net',
          'https://*.facebook.com',
          'https://*.facebook.net',
        ],
        'img-src': [
          "'self'",
          'data:',
          'blob:',
          '*',
        ],
        'media-src': [
          'https://*.intercomcdn.com',
          'https://*.gstatic.com',
        ],
        'connect-src': [
          "'self'",
          'data:',
          '*',
          'wss://*.intercom.io',
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
        ],
        'worker-src': [
          "'self'",
          'blob:',
        ],
        'report-uri': [
          process.env.SENTRY_REPORT_URI,
        ],
      },
    },
  },
  router: {
    extendRoutes(routes, resolve) {
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
  modules: [
    ['@nuxtjs/google-tag-manager', {
      id: process.env.GTM_ID || 'GTM-XXXXXXX',
      pageTracking: true,
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
        /* eslint-disable-next-line global-require, import/no-unresolved */
        const SentryPlugin = require('@sentry/webpack-plugin');
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
  /*
  ** Global CSS
  */
  css: [
    { src: '~/assets/css/index.scss', lang: 'scss' },
  ],
};
