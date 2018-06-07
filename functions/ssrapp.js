const functions = require('firebase-functions');
const { Nuxt } = require('nuxt-edge');

const config = {
  dev: false,
  debug: true,
  buildDir: 'nuxt',
};
const nuxt = new Nuxt(config);

module.exports = functions.https.onRequest((req, res) => nuxt.render(req, res));
