const functions = require('firebase-functions');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const URL = require('url-parse');
const Axios = require('axios');
const HttpAgent = require('agentkeepalive');

let IS_TESTNET = false;
if ((functions.config().likeco || {}).testmode) {
  process.env.IS_TESTNET = true;
  IS_TESTNET = true;
}

if ((functions.config().sentry || {}).report_uri) {
  process.env.SENTRY_REPORT_URI = functions.config().sentry.report_uri;
}
const LIKE_CO_HOSTNAME = IS_TESTNET ? 'rinkeby.like.co' : 'like.co';
const LIKECOIN_API_BASE = `https://api.${LIKE_CO_HOSTNAME}`;

const axios = Axios.create({
  httpAgent: new HttpAgent(),
  httpsAgent: new HttpAgent.HttpsAgent(),
});

function apiGetSuperLikeInfo(id) {
  return axios.get(`${LIKECOIN_API_BASE}/like/share/${id}`);
}

const app = express();
app.use(helmet());
app.use(cookieParser());
app.use('/:id', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const superLikeID = req.params.id;
  try {
    const { data } = await apiGetSuperLikeInfo(superLikeID);
    res.cookie('likebutton_superlike_id', superLikeID, {
      maxAge: 30000,
      secure: true,
      sameSite: 'none',
      domain: LIKE_CO_HOSTNAME,
    });
    let url = data.liker ? `https://like.co/${data.liker}` : 'https://liker.land';
    if (data && data.url) {
      url = new URL(data.url, true);
      url.query.superlike_id = superLikeID;
      url.set('query', url.query);
      url = url.toString();
    }
    res.redirect(url);
  } catch (err) {
    if (err.response && err.response.status) {
      console.error(err.response);
      res.status(err.response.status).send(err.response.data);
    } else {
      console.error(err);
      res.sendStatus(500);
    }
  }
});

module.exports = functions.https.onRequest(app);
