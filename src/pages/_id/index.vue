<template>
  <div>{{ $t('general.loading') }}</div>
</template>
<script>
export default {
  async fetch({
    params,
    redirect,
  }) {
    redirect({ name: 'in-like-id', params });
  },
};
</script>
