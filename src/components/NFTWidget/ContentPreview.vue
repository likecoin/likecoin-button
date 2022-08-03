<template>
  <a
    :href="url"
    :title="title"
    class="flex flex-col overflow-hidden rounded-[8px] bg-gray-f7 text-dark-gray"
    rel="noopener noreferrer"
    target="_blank"
    @click="handleClick"
  >
    <div
      v-if="imgSrc"
      :style="imgStyle"
      class="grow bg-gray-9b"
    >
      <img
        :src="imgSrc"
        :alt="title"
        class="block object-cover w-full"
      >
    </div>
    <div class="p-[16px] shrink-0">
      <div class="text-[16px] leading-[1.25] font-600">{{ title }}</div>
      <div class="text-[16px] leading-[1.25] font-400 mt-[4px]">
        {{ description }}
      </div>
    </div>
  </a>
</template>

<script>
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
      default: '',
    },
  },
  computed: {
    imgStyle() {
      return {
        backgroundColor: this.imgBgColor,
      };
    },
  },
  methods: {
    handleClick(event) {
      event.stopPropagation();
    },
  },
};
</script>
