import { LIKECOIN_CHAIN_RPC } from '../constant';

let iscnLib = null;
let queryClient = null;

export async function getISCNLib() {
  if (!iscnLib) {
    iscnLib = await import(/* webpackChunkName: "iscn_js" */ '@likecoin/iscn-js');
  }
  return iscnLib;
}

export async function getNFTQueryClient() {
  if (!queryClient) {
    const iscn = await getISCNLib();
    const client = new iscn.ISCNQueryClient();
    await client.connect(LIKECOIN_CHAIN_RPC);
    queryClient = client;
  }
  return queryClient;
}

export async function createNFTSigningClient(signer) {
  const iscn = await getISCNLib();
  const client = new iscn.ISCNSigningClient();
  await client.connectWithSigner(LIKECOIN_CHAIN_RPC, signer);
  return client;
}

export async function getClassInfo(classId) {
  const iscn = await getISCNLib();
  const c = await getNFTQueryClient();
  const client = await c.getQueryClient();
  let { class: nftClass } = await client.nft.class(classId);
  if (nftClass) nftClass = iscn.parseNFTClassDataFields(nftClass);
  return nftClass;
}

export const checkIsValidISCNId = value => /^iscn:\/\/([-_.:=+,a-zA-Z0-9]+)\/([-_.:=+,a-zA-Z0-9]+)(?:\/([0-9]+))?\/?$/.test(value);

export const checkIsValidNFTClassId = value => /^likenft1[ac-hj-np-z02-9]+$/.test(value);
