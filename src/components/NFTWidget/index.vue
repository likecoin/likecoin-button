<template>
  <div class="rounded-[16px]">
    <NFTWidgetBaseCard
      id="nft-basecard"
      class="transition-colors cursor-pointer hover:border-like-cyan-light"
      @click="handleViewDetails"
    >
      <NFTWidgetContentPreview
        v-if="isShowCover"
        :title="title"
        :description="description"
        :img-src="imgSrc"
        :url="url"
        :details-url="detailsUrl"
        :is-clickable="isContentClickable"
        :is-fixed-size="isFixedSize"
        @load-image="handleImageLoad"
      />
      <NFTWidgetCollectActionBar
        class="mt-[8px]"
        :price="price"
        :collector-count="collectorCount"
        :collected-count="collectedCount"
        :collect-button-label="collectButtonLabel"
        :purchase-url="purchaseUrl"
        :details-url="detailsUrl"
        @collect="handleCollect"
      />
    </NFTWidgetBaseCard>
    <NFTWidgetLikeActionBar
      v-if="isShowLikeBar"
      class="mt-[8px]"
      :creator-address="ownerAddress"
      :creator-display-name="ownerDisplayName"
      :creator-avatar-src="ownerAvatarSrc"
      :is-creator-civic-liker="isOwnerCivicLiker"
      :like-iscn-url="likeIscnUrl"
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
    isContentClickable: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      default: undefined,
    },
    collectorCount: {
      type: Number,
      default: undefined,
    },
    collectedCount: {
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
    ownerDisplayName: {
      type: String,
      default: undefined,
    },
    ownerAvatarSrc: {
      type: String,
      default: undefined,
    },
    isOwnerCivicLiker: {
      type: Boolean,
      default: undefined,
    },
    isFixedSize: {
      type: Boolean,
      default: true,
    },
    isShowCover: {
      type: Boolean,
      default: true,
    },
    isShowLikeBar: {
      type: Boolean,
      default: true,
    },
    detailsUrl: {
      type: String,
      default: '',
    },
    purchaseUrl: {
      type: String,
      default: '',
    },
    likeIscnUrl: {
      type: String,
      default: '',
    },
  },
  methods: {
    handleViewDetails() {
      this.$emit('view-details');
    },
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
