<template>
  <div class="embed-create-widget-button">
    <a
      :href="link"
      target="_blank"
      rel="noopener"
      @click="onClickCreate"
    >
      {{ $t(`Embed.label.createMy${isButton ? 'Button' : 'Widget'}`) }}
    </a>
  </div>
</template>

<script>
import { logTrackerEvent } from '@/util/EventLogger';

export default {
  name: 'embed-create-widget-button',
  props: {
    link: {
      type: String,
      default: 'https://like.co',
    },
    isButton: {
      type: [Boolean, String],
      default: false,
    },
  },
  methods: {
    onClickCreate() {
      logTrackerEvent(this, 'LikeButtonFlow', 'clickCreate', 'clickCreate', 1);
    },
  },
};
</script>

<style lang="scss">
@import "~assets/css/embed";

.embed-create-widget-button {
  margin-top: normalized(8);

  text-align: right;

  color: $gray-9b;

  font-size: normalized(10);
  line-height: normalized(10.5);

  @media screen and (max-width: 414px) {
    font-size: normalized(12);
    line-height: normalized(13);
  }

  a {
    display: inline-block;

    text-decoration: underline;

    color: inherit;

    font-size: inherit;
    line-height: inherit;
  }
}
</style>
