<script>
import { checkIsValidNFTClassId } from '~/util/nft';

export default {
  fetch({
    error,
    redirect,
    params: { classId },
    query,
  }) {
    if (checkIsValidNFTClassId(classId)) {
      redirect({ name: 'in-embed-nft', query: { ...query, class_id: classId } });
    } else {
      error({ statusCode: 400, message: 'INVALID_NFT_CLASS_ID' });
    }
  },
};
</script>
