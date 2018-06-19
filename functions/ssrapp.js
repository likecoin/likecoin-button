const functions = require('firebase-functions');
const { Nuxt } = require('nuxt-edge');

const nuxtConfig = require('./nuxt.config.js');

const config = {
  ...nuxtConfig,
  dev: false,
  debug: true,
  buildDir: 'nuxt',
};
const nuxt = new Nuxt(config);

module.exports = functions.https.onRequest((req, res) => {
  res.set('Cache-Control', 'public, max-age=60, s-maxage=60, stale-if-error=60');
  return nuxt.render(req, res);
});
