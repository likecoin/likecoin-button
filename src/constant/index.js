export const { IS_TESTNET } = process.env;

export const TEST_MODE = process.env.NODE_ENV !== 'production' || process.env.CI;

export const ETH_NETWORK_NAME = IS_TESTNET ? 'rinkeby' : 'mainnet';

export const LIKECOIN_API = IS_TESTNET ? 'https://api.rinkeby.like.co' : 'https://api.like.co';

export const EXTERNAL_HOSTNAME = IS_TESTNET ? 'button.rinkeby.like.co' : 'button.like.co';

export const LIKE_CO_HOSTNAME = IS_TESTNET ? 'rinkeby.like.co' : 'like.co';

export const LIKER_LAND_URL_BASE = IS_TESTNET ? 'https://rinkeby.liker.land' : 'https://liker.land';

/* use LIKE_CO_HOSTNAME for now to prevent CORS preflight problem
 should USE EXTERNAL_HOSTNAME in future */
export const LIKECOIN_MISC_API_BASE = `https://${LIKE_CO_HOSTNAME}/api`;

export const LIKECOIN_OEMBED_API_BASE = `https://${LIKE_CO_HOSTNAME}/api/oembed`;

export const W3C_EMAIL_REGEX = '^[a-zA-Z0-9.!#$%&\'*/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$';

/* TEMP: reformat medium referrer into medium post */
export const MEDIUM_MEDIA_REGEX = /^(?:https?:\/\/)?[^/]*\/media\/[a-zA-Z0-9_]+(?:\?postId=([a-zA-Z0-9_]+))?/;

export const CIVIC_LIKER_START_DATE = 1546300800000; // 2019-01-01T08:00:00+0800
export const CIVIC_LIKER_TRIAL_END_DATE = 1548950399000; // 2019-01-31T23:59:59+0800

export const QUERY_STRING_TO_REMOVE = [
  'fbclid',
  'gclid',
  'gi',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
];

export const MEDIUM_QUERY_STRING_TO_REMOVE = [
  'source',
  'postPublishedType',
];
