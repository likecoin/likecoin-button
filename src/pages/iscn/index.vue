<script>
export default {
  fetch({ redirect, query }) {
    // Redirect
    // /iscn?iscn_id=:iscn_id -> /in/like/iscn?iscn_id=:iscn_id
    redirect({ name: 'in-like-id', params: { id: 'iscn' }, query });
  },
};
</script>
