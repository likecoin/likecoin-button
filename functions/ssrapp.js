const functions = require('firebase-functions');
const { Nuxt } = require('nuxt');

if ((functions.config().likeco || {}).testmode) {
  process.env.IS_TESTNET = true;
}

if ((functions.config().sentry || {}).report_uri) {
  process.env.SENTRY_REPORT_URI = functions.config().sentry.report_uri;
}

const nuxtConfig = require('./nuxt.config.js');

const config = {
  ...nuxtConfig,
  dev: false,
  debug: true,
  buildDir: 'nuxt',
};
const nuxt = new Nuxt(config);

module.exports = functions.https.onRequest((req, res) => {
  res.set('Cache-Control', 'public, max-age=600, s-maxage=600, stale-if-error=600');
  return nuxt.render(req, res);
});
