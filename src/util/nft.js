import { ISCNQueryClient, ISCNSigningClient } from '@likecoin/iscn-js';
import { parseNFTClassDataFields } from '@likecoin/iscn-js/dist/messages/parsing';
import { LIKECOIN_CHAIN_RPC } from '../constant';

let queryClient = null;
export async function getNFTQueryClient() {
  if (!queryClient) {
    const client = new ISCNQueryClient();
    await client.connect(LIKECOIN_CHAIN_RPC);
    queryClient = client;
  }
  return queryClient;
}

export async function createNFTSigningClient(signer) {
  const client = new ISCNSigningClient();
  await client.connectWithSigner(LIKECOIN_CHAIN_RPC, signer);
  return client;
}

export async function getClassInfo(classId) {
  const c = await getNFTQueryClient();
  const client = await c.getQueryClient();
  let { class: nftClass } = await client.nft.class(classId);
  if (nftClass) nftClass = parseNFTClassDataFields(nftClass);
  return nftClass;
}

export const checkIsValidISCNId = value => value.startsWith('iscn://likecoin-chain');

export const checkIsValidNFTClassId = value => value.startsWith('likenft1');
