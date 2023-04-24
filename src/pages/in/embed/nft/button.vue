<template>
  <button
    class="
      py-[10px]
      px-[16px]
      rounded-[8px]
      flex
      items-center
      bg-like-cyan-light
      hover:bg-like-cyan
      active:bg-like-cyan-dark
      transition-colors
      text-like-green
      font-600
      leading-[1.25]
    "
    @click.stop="collectNFT"
  >
    <NFTWidgetIconInsertCoin class="mr-[12px]" />
    {{ collectButtonLabel }}
  </button>
</template>

<script>
import nftMixin from '~/mixins/nft';

export default {
  mixins: [nftMixin],
  computed: {
    collectButtonLabel() {
      return this.$route.query.cta_button_label || this.$t('cta_nft_collect_button');
    },
  },
};
</script>
