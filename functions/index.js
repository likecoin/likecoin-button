/* eslint-disable global-require */

if (!process.env.K_SERVICE || process.env.K_SERVICE === 'ssrapp') {
  exports.ssrapp = require('./ssrapp');
}

if (!process.env.K_SERVICE || process.env.K_SERVICE === 'superlike') {
  exports.superlike = require('./superlike');
}

if (!process.env.K_SERVICE || process.env.K_SERVICE === 'imagessr') {
  exports.imagessr = require('./imagessr');
}
