const functions = require('firebase-functions');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const onHeaders = require('on-headers');
const { Nuxt } = require('nuxt-start');

if ((functions.config().likeco || {}).testmode) {
  process.env.IS_TESTNET = true;
}

if ((functions.config().sentry || {}).report_uri) {
  process.env.SENTRY_REPORT_URI = functions.config().sentry.report_uri;
}

const nuxtConfig = require('./nuxt.config.js');

function setCacheHeader(req, res, next) {
  onHeaders(res, () => {
    if (res.statusCode >= 200 && res.statusCode <= 399) {
      res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=600, stale-if-error=3600');
    } else {
      res.setHeader('Cache-Control', 'no-store');
    }
    if (nuxtConfig.googleOptimize) { // cookie sensitive ab testing
      res.setHeader('Vary', 'Cookie, Accept-Language');
    } else {
      res.setHeader('Vary', 'Accept-Language');
    }
  });
  next();
}

const config = {
  ...nuxtConfig,
  dev: false,
  buildDir: 'nuxt',
};
const nuxt = new Nuxt(config);

const app = express();
app.use(helmet({
  frameguard: false,
}));
app.use(cookieParser());
app.use(['/in/embed', '/in/like'], setCacheHeader);
app.use(async (req, res) => {
  await nuxt.ready();
  nuxt.render(req, res);
});
module.exports = functions.https.onRequest(app);
