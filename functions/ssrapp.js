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

module.exports = functions.https.onRequest((req, res) => nuxt.render(req, res));
