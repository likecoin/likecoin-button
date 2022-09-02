<script>
export default {
  fetch({
    redirect,
    query: { iscn_id: iscnId, class_id: nftClassId, ...query },
  }) {
    // Redirect
    if (iscnId) {
      // /?iscn_id=:iscn_id -> /in/like/iscn?iscn_id=:iscn_id
      redirect({
        name: 'in-like-id',
        params: { id: 'iscn' },
        query: { ...query, iscn_id: iscnId },
      });
    } else if (nftClassId) {
      // /?class_id=:class_id -> /in/nft?class_id=:class_id
      redirect({
        name: 'in-nft',
        query: { ...query, class_id: nftClassId },
      });
    } else {
      redirect('https://docs.like.co/user-guide/creator');
    }
  },
};
</script>
