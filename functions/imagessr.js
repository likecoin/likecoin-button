// TODO: eslint import cannot handle firebase module
// eslint-disable-next-line import/no-unresolved
const { onRequest } = require('firebase-functions/v2/https');
const express = require('express');
const axios = require('axios');
const nodeHtmlToImage = require('node-html-to-image');
const sharp = require('sharp');

const app = express();

app.get(['/in/embed/**', '/in/like/**'], async (req, res) => {
  try {
    if (!req.path.includes('/image')) {
      res.status(400).send('INVALID_URL');
      return;
    }
    const { EXTERNAL_HOSTNAME } = process.env;
    const url = `https://${EXTERNAL_HOSTNAME}${req.originalUrl.replace('/image', '')}`;
    const { data } = await axios.get(url);
    const image = await nodeHtmlToImage({
      html: data,
      quality: 100,
      type: 'jpeg',
      selector: '#__layout > div',
      puppeteerArgs: {
        defaultViewport: {
          width: 360,
          height: 480,
          deviceScaleFactor: 2.0,
        },
      },
    });
    const withMetadata = await sharp(image)
      .withMetadata({ density: 144 })
      .toBuffer();
    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=3600, stale-if-error=3600',
    });
    res.end(withMetadata, 'binary');
  } catch (err) {
    console.error(JSON.stringify(err));
    res.sendStatus(500);
  }
});

module.exports = onRequest({ region: ['us-west1'], memory: '512MB' }, app);
