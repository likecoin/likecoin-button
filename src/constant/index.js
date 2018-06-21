export const { IS_TESTNET } = process.env;

export const ETH_NETWORK_NAME = IS_TESTNET ? 'rinkeby' : 'mainnet';

export const LIKECOIN_API = IS_TESTNET ? 'https://api.rinkeby.like.co' : 'https://api.like.co';
