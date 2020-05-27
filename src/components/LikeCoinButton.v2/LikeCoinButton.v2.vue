<template>
  <button>{{ count }}</button>
</template>

<script>
export default {
  name: 'likecoin-button-v2',
  props: {
    count: {
      type: Number,
      default: 0,
    },
  },
};
</script>
