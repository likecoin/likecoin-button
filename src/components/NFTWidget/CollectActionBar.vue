<template>
  <div
    class="grid items-center justify-between grid-flow-col gap-[16px] py-[8px] pl-[16px]"
  >
    <a
      :href="detailsUrl"
      @click.prevent
    >
      <ul class="flex items-center flex-wrap gap-x-[20px] gap-y-[16px]">
        <li class="flex items-center text-[12px] leading-[5/3] font-600 text-medium-gray">
          <NFTWidgetIconNFT class="w-[16px]" />
          <span class="ml-[6px]">{{ collectedCount }}</span>
        </li>
        <li class="flex items-center text-[12px] leading-[5/3] font-600 text-medium-gray">
          <NFTWidgetIconOwner class="w-[16px]" />
          <span class="ml-[6px]">{{ collectorCount }}</span>
        </li>
        <li class="flex text-[16px] leading-[1.25] text-like-green font-600">
          <NFTWidgetIconInsertCoin class="mr-[6px]" />
          ${{ formattedPrice }}
        </li>
      </ul>
    </a>
    <a
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
      :href="purchaseUrl"
      @click.prevent.stop="onClickCollectButton"
    >
      <NFTWidgetIconInsertCoin class="mr-[12px]" />
      {{ collectButtonLabel }}
    </a>
  </div>
</template>

<script>
export default {
  props: {
    collectButtonLabel: {
      type: String,
      default: 'Collect Now',
    },
    price: {
      type: Number,
      default: 0,
    },
    collectorCount: {
      type: Number,
      default: 0,
    },
    collectedCount: {
      type: Number,
      default: 0,
    },
    detailsUrl: {
      type: String,
      default: '',
    },
    purchaseUrl: {
      type: String,
      default: '',
    },
  },
  computed: {
    formattedPrice() {
      return this.price;
    },
  },
  methods: {
    onClickCollectButton(e) {
      this.$emit('collect', e);
    },
  },
};
</script>
