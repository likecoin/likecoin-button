// TODO: eslint import cannot handle firebase module
// eslint-disable-next-line import/no-unresolved
const { onRequest } = require('firebase-functions/v2/https');
const express = require('express');
const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const sharp = require('sharp');

const RESOURCES_TIMEOUT = 10000; // 10s

let globalBrowser = null;

async function getBrowser() {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });
  return browser;
}

async function getNewPage(browser, { width = 1024, height = 768 } = {}) {
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(RESOURCES_TIMEOUT);
  page.setDefaultTimeout(RESOURCES_TIMEOUT);
  await page.setUserAgent('LikeCoin Button Image SSR');
  await page.setViewport({ width, height });
  return page;
}

async function makeScreenshot(page, url, {
  selector = 'body',
  type = 'png',
  quality = 80,
  encoding = 'binary',
} = {}) {
  await page.goto(url);
  const element = await page.$(selector);
  if (!element) {
    throw Error('SELECTOR_NOT_FOUND');
  }
  const buffer = await element.screenshot({
    type,
    encoding,
    quality,
  });
  return buffer;
}

const app = express();

app.get(['/in/embed/**', '/in/like/**'], async (req, res) => {
  let page;
  try {
    if (!req.path.includes('/image')) {
      res.status(400).send('INVALID_URL');
      return;
    }
    const scale = Number(req.query.scale) || 1;
    const { EXTERNAL_HOSTNAME } = process.env;
    if (!globalBrowser) {
      globalBrowser = getBrowser();
    }
    const url = `https://${EXTERNAL_HOSTNAME}${req.originalUrl.replace('/image', '')}`;
    const browser = await globalBrowser;
    page = await getNewPage(browser, {
      width: 360,
      height: 373,
    });
    const image = await makeScreenshot(page, url, {
      type: 'jpeg',
      selector: '#nft-basecard',
      quality: 100,
    });
    const withMetadata = await sharp(image)
      .withMetadata({ density: 77 * scale })
      .toBuffer();
    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=3600, stale-if-error=3600',
    });
    res.end(withMetadata, 'binary');
  } catch (err) {
    if (err.message === 'SELECTOR_NOT_FOUND') {
      res.status(400).send('NOT_WRITING_NFT');
      return;
    }
    console.error(JSON.stringify(err));
    res.sendStatus(500);
  } finally {
    if (page) page.close();
  }
});

module.exports = onRequest({ region: ['us-west1'], memory: '512MB' }, app);
