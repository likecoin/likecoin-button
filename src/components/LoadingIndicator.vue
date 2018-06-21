<template>
  <div :class="['loading-indicator', layout]" :style="style">
    <div :key="n" v-for="n in NUM_DOTS" />
  </div>
</template>


<script>
export default {
  name: 'loading-indicator',
  data() {
    return {
      NUM_DOTS: 3,
    };
  },
  props: {
    color: {
      type: String,
      default: '#28646e',
    },
    layout: {
      type: String,
      validator(value) {
        return ['small', 'large', 'fluid'].indexOf(value) !== -1;
      },
      default: 'fluid',
    },
  },
  computed: {
    style() {
      return {
        color: this.color,
      };
    },
  },
};
</script>


<style lang="scss" scoped>
@mixin medium-loading-indicator {
  width: 5px;
  margin: 3px;
}

@mixin small-loading-indicator {
  width: 4px;
  margin: 2px;
}

.loading-indicator {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  > div {
    animation: wave 1.5s infinite ease-in-out;

    &:nth-child(1) {
      animation-delay: 0.3s;
    }
    &:nth-child(2) {
      animation-delay: 0.15s;
    }
    flex-shrink: 0;

    &::before {
      content: " ";
      position: relative;
      border-radius: 50%;
      background: currentColor;
      width: 100%;
      padding-top: 100%;
      display: block;
    }
  }

  &.small > div {
    @include small-loading-indicator();
  }

  &.large > div {
    @include medium-loading-indicator();
  }

  &.fluid > div {
    @media (min-width: 600px + 1px) {
      @include medium-loading-indicator();
    }

    @media (max-width: 600px) {
      @include small-loading-indicator();
    }
  }
}

@keyframes wave {
  0%, 40% {
    transform: translateY(0px);
  }
  10% {
    transform: translateY(-4px);
  }
}
</style>
