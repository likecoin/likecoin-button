<script>
import { checkIsValidISCNId, checkIsValidNFTClassId } from '~/util/nft';

export default {
  fetch({
    error,
    redirect,
    params: { id },
    query,
  }) {
    if (checkIsValidISCNId(id)) {
      redirect({
        name: 'in-like-id',
        params: { id: 'iscn' },
        query: { ...query, iscn_id: id }
      });
    } else if (checkIsValidNFTClassId(id)) {
      redirect({
        name: 'in-nft',
        query: { ...query, class_id: id },
      });
    } else {
      error({ statusCode: 400, message: 'INVALID_NFT_IDENTIFIER' });
    }
  },
};
</script>
