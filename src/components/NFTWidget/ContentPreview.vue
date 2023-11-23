<template>
  <a
    v-bind="props"
    :title="title"
    class="flex flex-col overflow-hidden rounded-[8px] bg-gray-f7 text-dark-gray"
    :href="href"
    @click.prevent="handleClick"
  >
    <div
      v-if="imgSrc"
      :class="imgWrapperClasses"
      :style="imgWrapperStyle"
    >
      <img
        :class="imgClasses"
        :src="resizedSrc"
        :alt="title"
        @load="handleLoadImage"
      >
    </div>
    <div class="p-[16px] shrink-0">
      <div :class="titleClasses">{{ title }}</div>
      <div :class="descriptionClasses">{{ description }}</div>
    </div>
  </a>
</template>

<script>
import { getLikeCoResizedImageUrl } from '~/util/ui';

export default {
  props: {
    imgSrc: {
      type: String,
      default: undefined,
    },
    imgBgColor: {
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
    isClickable: {
      type: Boolean,
      default: true,
    },
    isFixedSize: {
      type: Boolean,
      default: true,
    },
    detailsUrl: {
      type: String,
      default: '',
    },
  },
  computed: {
    href() {
      return this.isClickable ? this.url : this.detailsUrl;
    },
    props() {
      if (!this.isClickable) { return {}; }
      return {
        href: this.url,
        rel: 'noopener noreferrer',
        target: '_blank',
      }
    },
    resizedSrc() {
      if (this.isFixedSize) { return getLikeCoResizedImageUrl(this.imgSrc, 360); }
      return this.imgSrc;
    },
    titleClasses() {
      return [
        'text-[16px]',
        'leading-[1.25]',
        'font-600',
        {
          'whitespace-nowrap': this.isFixedSize,
          'overflow-hidden': this.isFixedSize,
          'overflow-ellipsis': this.isFixedSize,
        },
      ];
    },
    descriptionClasses() {
      return [
        'text-[16px]',
        'leading-[1.25]',
        'font-400',
        'mt-[4px]',
        {
          'whitespace-nowrap': this.isFixedSize,
          'overflow-hidden': this.isFixedSize,
          'overflow-ellipsis': this.isFixedSize,
        },
      ];
    },
    imgWrapperClasses() {
      return [
        'grow',
        'bg-gray-9b',
        {
          relative: this.isFixedSize,
        },
      ];
    },
    imgWrapperStyle() {
      return {
        paddingTop: this.isFixedSize ? '56.25%' : 0,
        backgroundColor: this.imgBgColor,
      };
    },
    imgClasses() {
      return [
        'block',
        'object-cover',
        'w-full',
        {
          absolute: this.isFixedSize,
          'inset-0': this.isFixedSize,
          'h-full': this.isFixedSize,
        }
      ];
    },
  },
  methods: {
    handleClick(event) {
      if (this.tag === 'a' && this.url) {
        event.stopPropagation();
      } else {
        this.$emit('click', event);
      }
    },
    handleLoadImage() {
      this.$emit('load-image');
    },
  },
};
</script>
