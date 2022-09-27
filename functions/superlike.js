// TODO: eslint import cannot handle firebase module
// eslint-disable-next-line import/no-unresolved
const { onRequest } = require('firebase-functions/v2/https');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const URL = require('url-parse');
const Axios = require('axios');
const HttpAgent = require('agentkeepalive');
const base64url = require('base64url');

const IS_TESTNET = process.env.IS_TESTNET === 'TRUE';

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
  const inputId = req.params.id;
  let superLikeID;
  try {
    const inputNumber = Number(inputId);
    if (inputNumber) superLikeID = inputId;
  } catch (err) {
    console.error(err);
  }
  if (!superLikeID) {
    try {
      const buf = base64url.toBuffer(inputId);
      if (buf.length !== 8) throw new Error('INVALID_BUFFER_LENGTH');
      const numericID = buf.readBigInt64BE();
      if (numericID) superLikeID = numericID.toString();
    } catch (err) {
      console.error(err);
    }
  }
  if (!superLikeID) {
    res.status(400).send('INVALID_ID');
    return;
  }
  try {
    const { data } = await apiGetSuperLikeInfo(superLikeID);
    res.cookie('likebutton_superlike_id', superLikeID, {
      maxAge: 30000,
      secure: true,
      sameSite: 'none',
      domain: LIKE_CO_HOSTNAME,
    });
    let urlString = data.liker ? `https://like.co/${data.liker}` : 'https://liker.land';
    if (data && data.url) {
      const url = new URL(data.url, true);
      url.query.superlike_id = superLikeID;
      url.set('query', url.query);
      urlString = url.toString();
    }
    res.redirect(urlString);
  } catch (err) {
    if (err.response && err.response.status) {
      console.error(err.response.data);
      res.status(err.response.status).send(err.response.data);
    } else {
      console.error(err);
      res.sendStatus(500);
    }
  }
});

module.exports = onRequest({ region: ['us-west1'] }, app);
