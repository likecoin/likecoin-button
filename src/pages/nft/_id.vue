<script>
import { checkIsValidISCNId, checkIsValidNFTClassId } from '../../util/nft';

export default {
  fetch({
    error,
    redirect,
    params: { id },
    query,
  }) {
    // Redirect
    if (checkIsValidISCNId(id)) {
      // /nft/:iscn_id  -> /in/like/iscn?iscn_id=:iscn_id
      redirect({
        name: 'in-like-id',
        params: { id: 'iscn' },
        query: { iscn_id: id, ...query },
      });
    } else if (checkIsValidNFTClassId(id)) {
      // /nft/:class_id -> /in/nft?class_id=:class_id
      redirect({ name: 'in-nft', query: { class_id: id, ...query } });
    } else {
      error({ statusCode: 400, message: 'MISSING_NFT_IDENTIFER' });
    }
  },
};
</script>
