// TODO: eslint import cannot handle firebase module
// eslint-disable-next-line import/no-unresolved
const { onRequest } = require('firebase-functions/v2/https');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const onHeaders = require('on-headers');
const { Nuxt } = require('nuxt-start');

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

module.exports = onRequest({ region: ['us-west1'] }, app);
