<script>
import { checkIsValidISCNId } from '~/util/nft';

export default {
  fetch({
    error,
    redirect,
    params: { iscnId },
    query,
  }) {
    if (checkIsValidISCNId(iscnId)) {
      redirect({ name: 'in-embed-nft', query: { ...query, iscn_id: iscnId } });
    } else {
      error({ statusCode: 400, message: 'INVALID_ISCN_ID' });
    }
  },
};
</script>
