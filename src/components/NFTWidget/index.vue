<template>
  <div class="rounded-[16px]">
    <NFTWidgetBaseCard>
      <NFTWidgetContentPreview
        :title="title"
        :description="description"
        :img-src="imgSrc"
      />
      <NFTWidgetCollectActionBar
        :price="price"
        :collect-button-label="collectButtonLabel"
        @collect="handleCollect"
        class="mt-[8px]"
      />
    </NFTWidgetBaseCard>
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
    price: {
      type: Number,
      default: undefined,
    },
    collectButtonLabel: {
      type: String,
      default: undefined,
    },
  },
  methods: {
    handleCollect() {
      // TODO
    },
  },
};
</script>
