export const { IS_TESTNET } = process.env;

export const TEST_MODE = process.env.NODE_ENV !== 'production' || process.env.CI;

export const ETH_NETWORK_NAME = IS_TESTNET ? 'rinkeby' : 'mainnet';

export const LIKECOIN_API = IS_TESTNET ? 'https://api.rinkeby.like.co' : 'https://api.like.co';

export const EXTERNAL_HOSTNAME = IS_TESTNET ? 'button.rinkeby.like.co' : 'button.like.co';

export const LIKE_CO_HOSTNAME = IS_TESTNET ? 'rinkeby.like.co' : 'like.co';

/* use LIKE_CO_HOSTNAME for now to prevent CORS preflight problem
 should USE EXTERNAL_HOSTNAME in future */
export const LIKECOIN_MISC_API_BASE = `https://${LIKE_CO_HOSTNAME}`;

export const W3C_EMAIL_REGEX = '^[a-zA-Z0-9.!#$%&\'*/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$';

/* TEMP: reformat medium referrer into medium post */
export const MEDIUM_REGEX = /^(?:https?:\/\/)?[^/]*\/media\/[a-zA-Z0-9_]+(?:\?postId=([a-zA-Z0-9_]+))?/;
