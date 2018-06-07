/* eslint-disable global-require */

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'ssrapp') {
  exports.ssrapp = require('./ssrapp');
}

if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === 'like') {
  exports.like = require('./like');
}
