<script>
import { checkIsValidISCNId, checkIsValidNFTClassId } from '~/util/nft';

export default {
  fetch({
    redirect,
    params: { id },
    query,
  }) {
    if (checkIsValidISCNId(id)) {
      redirect({ name: 'in-embed-nft', query: { ...query, iscn_id: id } });
    } else if (checkIsValidNFTClassId(id)) {
      redirect({ name: 'in-embed-nft', query: { ...query, class_id: id } });
    } else {
      redirect('/')
    }
  },
};
</script>
