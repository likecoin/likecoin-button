/* eslint-disable global-require */

if (!process.env.K_SERVICE || process.env.K_SERVICE === 'ssrapp') {
  exports.ssrapp = require('./ssrapp');
}

if (!process.env.K_SERVICE || process.env.K_SERVICE === 'superLikeRedirect') {
  exports.superLikeRedirect = require('./superLikeRedirect');
}
