const functions = require('firebase-functions');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { Nuxt } = require('nuxt-start');

function setNoCacheHeader(req, res, next) {
  res.setHeader('Cache-Control', 'public, max-age=600, must-revalidate');
  res.setHeader('Vary', 'Cookie, Accept-Language');
  next();
}

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
  buildDir: 'nuxt',
};
const nuxt = new Nuxt(config);

const app = express();
app.use(helmet({
  frameguard: false,
}));
app.use(cookieParser());
app.use(setNoCacheHeader);
app.use(nuxt.render);

module.exports = functions.https.onRequest(app);
