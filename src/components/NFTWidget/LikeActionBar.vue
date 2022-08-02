<template>
  <NFTWidgetBaseCard class="flex items-center justify-between px-[24px]">
    <button
      @click="handleClickLike"
      class="flex items-center transition-colors text-medium-gray hover:text-dark-gray"
    >
      <NFTWidgetIconLike class="w-[20px] h-[20px]" />
      <span class="ml-[12px]">{{ likeActionLabel }}</span>
    </button>
    <div class="flex items-center text-dark-gray ml-[8px]">
      <NuxtLink
        :to="`/${creatorAddress}`"
        class="flex items-center text-like-green group -my-[8px]"
        target="_blank"
      >
        <Identity
          :avatar-url="creatorAvatarSrc"
          :avatar-size="32"
          :is-avatar-outlined="isCivicLiker"
        />
        <span class="ml-[8px] group-hover:underline">{{ formattedCreatorDisplayName }}</span>
      </NuxtLink>
    </div>
  </NFTWidgetBaseCard>
</template>

<script>
import { ellipsis } from '~/util/ui';
import Identity from '~/components/Identity/Identity';

export default {
  components: {
    Identity,
  },
  props: {
    iscnId: {
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
    isCivicLiker: {
      type: Boolean,
      default: false,
    },
    likeActionLabel: {
      type: String,
      default: 'Like',
    },
  },
  computed: {
    formattedCreatorDisplayName() {
      return ellipsis(this.creatorDisplayName);
    },
  },
  methods: {
    handleClickLike() {
      this.$emit('like');
    },
  },
};
</script>
