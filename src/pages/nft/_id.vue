<script>
import { checkIsValidISCNId, checkIsValidNFTClassId } from '../../util/nft';

export default {
  fetch({
    error,
    redirect,
    params: { id },
    query: { iscn_id: qsIscnId, class_id: qsClassId, ...query },
  }) {
    let iscnId;
    let classId;
    if ((qsIscnId && checkIsValidISCNId(qsIscnId))) {
      // /nft?iscn_id=:iscn_id
      iscnId = qsIscnId;
    } else if (id && checkIsValidISCNId(id)) {
      // /nft/:iscn_id
      iscnId = id;
    } else if (qsClassId && checkIsValidNFTClassId(qsClassId)) {
      // /nft?class_id=:class_id
      classId = qsClassId;
    } else if (id && checkIsValidNFTClassId(id)) {
      // /nft/:class_id
      classId = id;
    }

    if (iscnId) {
      redirect({
        name: 'in-like-id',
        params: { id: 'iscn' },
        query: { ...query, iscn_id: iscnId },
      });
    } else if (classId) {
      redirect({
        name: 'in-embed-nft',
        query: { ...query, class_id: classId },
      });
    } else {
      error({ statusCode: 400, message: 'INVALID_NFT_IDENTIFIER' });
    }
  },
};
</script>
