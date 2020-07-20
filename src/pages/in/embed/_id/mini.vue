<script>
export default {
  fetch({ redirect, params, query }) {
    redirect(302, { name: 'in-embed-id-button', params, query });
  },
};
</script>
