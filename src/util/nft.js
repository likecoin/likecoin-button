export const checkIsValidISCNId = value => /^iscn:\/\/([-_.:=+,a-zA-Z0-9]+)\/([-_.:=+,a-zA-Z0-9]+)(?:\/([0-9]+))?\/?$/.test(value);

export const checkIsValidNFTClassId = value => /^likenft1[ac-hj-np-z02-9]+$/.test(value);

export function parseImageURLFromMetadata(image) {
  return image.replace('ar://', 'https://arweave.net/').replace('ipfs://', 'https://ipfs.io/ipfs/');
}
