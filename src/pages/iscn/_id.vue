<script>
export default {
  fetch({ redirect, params, query }) {
    // Redirect
    // /iscn/:iscn_id  -> /in/like/iscn?iscn_id=:iscn_id
    redirect({
      name: 'in-like-id',
      params: { id: 'iscn' },
      query: { iscn_id: params.id, ...query },
    });
  },
};
</script>
