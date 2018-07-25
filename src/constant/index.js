export const { IS_TESTNET } = process.env;

export const TEST_MODE = process.env.NODE_ENV !== 'production' || process.env.CI;

export const ETH_NETWORK_NAME = IS_TESTNET ? 'rinkeby' : 'mainnet';

export const LIKECOIN_API = IS_TESTNET ? 'https://api.rinkeby.like.co' : 'https://api.like.co';

export const EXTERNAL_HOSTNAME = IS_TESTNET ? 'button.rinkeby.like.co' : 'button.like.co';

export const LIKE_CO_HOSTNAME = IS_TESTNET ? 'https://rinkeby.like.co' : 'https://like.co';

export const LIKECOIN_MISC_API_BASE = `https://${EXTERNAL_HOSTNAME}`;
