<template>
  <div class="rounded-[16px]">
    <NFTWidgetBaseCard>
      <NFTWidgetContentPreview
        class="transition-shadow cursor-pointer hover:shadow-[0_0_0_2px_#aaf1e7]"
        :title="title"
        :description="description"
        :img-src="imgSrc"
        :url="url"
        @load-image="handleImageLoad"
      />
      <NFTWidgetCollectActionBar
        :price="price"
        :collect-button-label="collectButtonLabel"
        class="mt-[8px]"
        @collect="handleCollect"
      />
    </NFTWidgetBaseCard>
    <NFTWidgetLikeActionBar
      class="mt-[8px]"
      :creator-address="ownerAddress"
      @like="handleLike"
    />
  </div>
</template>

<script>
export default {
  props: {
    imgSrc: {
      type: String,
      default: undefined,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: undefined,
    },
    price: {
      type: Number,
      default: undefined,
    },
    collectButtonLabel: {
      type: String,
      default: undefined,
    },
    ownerAddress: {
      type: String,
      default: undefined,
    },
  },
  methods: {
    handleCollect() {
      this.$emit('collect');
    },
    handleLike() {
      this.$emit('like');
    },
    handleImageLoad() {
      this.$emit('load-image');
    },
  },
};
</script>
