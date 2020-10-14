<template>
  <div>{{ $t('general.loading') }}</div>
</template>
<script>
export default {
  head() {
    return {
      title: this.$t('LikeButton.head.title', { name: this.id }),
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t('LikeButton.head.title', { name: this.id }),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('LikeButton.head.description'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('LikeButton.head.description'),
        },
      ],
    };
  },
  computed: {
    id() {
      return this.params.id;
    },
  },
  async fetch({
    params,
    redirect,
  }) {
    redirect({ name: 'in-like-id', params });
  },
};
</script>
