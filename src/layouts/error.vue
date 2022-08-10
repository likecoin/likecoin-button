<template>
  <div class="lc-container">
    <div class="title">{{ message }}</div>
    <p v-if="statusCode === 404">
      <a
        :href="HOMEPAGE"
        class="error-link"
      >
        {{ $t('general.back') }}
      </a>
    </p>
  </div>
</template>

<script>
const HOMEPAGE = 'https://like.co';

export default {
  name: 'nuxt-error',
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  head() {
    return {
      title: this.message,
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no',
        },
      ],
    };
  },
  data() {
    return {
      HOMEPAGE,
    };
  },
  computed: {
    statusCode() {
      return (this.error && this.error.statusCode) || 500;
    },
    message() {
      return this.error.message || 'Error';
    },
  },
  watch: {
    error(newErr) {
      if (newErr) {
        // eslint-disable-next-line no-console
        console.error(newErr);
      }
    },
  },
  mounted() {
    // XXX: Mitigate Firebase function double decoding
    if (this.$route.path.startsWith('/in/embed/nft/iscn/iscn:/likecoin-chain')) {
      this.$router.replace({
        name: 'in-embed-nft-iscn-iscnId',
        params: {
          iscnId: this.$route.path.replace('/in/embed/nft/iscn/iscn:/', 'iscn://'),
        },
        query: this.$route.query,
      });
      return;
    }

    // eslint-disable-next-line no-console
    console.error(this.error);
    setTimeout(() => {
      window.location.href = HOMEPAGE;
    }, 3000);
  },
};
</script>
