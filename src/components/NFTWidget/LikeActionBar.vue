<template>
  <NFTWidgetBaseCard class="flex items-center justify-between px-[24px]">
    <a
      class="flex items-center transition-colors text-medium-gray hover:text-dark-gray"
      :href="likeIscnUrl"
      @click.prevent="handleClickLike"
    >
      <NFTWidgetIconLike class="w-[20px] h-[20px]" />
      <span class="ml-[12px]">{{ likeActionLabel }}</span>
    </a>
    <div class="flex items-center text-dark-gray ml-[8px]">
      <client-only>
        <a
          :href="creatorURL"
          class="flex items-center text-like-green group my-[-8px]"
          target="_blank"
        >
          <IdentityV2
            :avatar-url="creatorAvatarSrc"
            :avatar-size="32"
            :is-avatar-outlined="isCreatorCivicLiker"
          />
          <span class="ml-[8px] group-hover:underline">{{ formattedCreatorName }}</span>
        </a>
      </client-only>
    </div>
  </NFTWidgetBaseCard>
</template>

<script>
import { LIKER_LAND_URL_BASE } from '~/constant';
import { ellipsis } from '~/util/ui';

export default {
  props: {
    iscnId: {
      type: String,
      default: '',
    },
    likeIscnUrl: {
      type: String,
      default: '',
    },
    creatorAvatarSrc: {
      type: String,
      default: '',
    },
    creatorDisplayName: {
      type: String,
      default: '',
    },
    creatorAddress: {
      type: String,
      default: '',
    },
    isCreatorCivicLiker: {
      type: Boolean,
      default: false,
    },
    likeActionLabel: {
      type: String,
      default: 'Like',
    },
  },
  computed: {
    formattedCreatorName() {
      return ellipsis(this.creatorDisplayName || this.creatorAddress);
    },
    creatorURL() {
      return `${LIKER_LAND_URL_BASE}/${this.creatorAddress}?utm_source=widget`;
    },
  },
  methods: {
    handleClickLike() {
      this.$emit('like');
    },
  },
};
</script>
