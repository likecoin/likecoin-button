<template>
  <transition name="popup-notice-overlay-">
    <div
      v-if="isShow"
      class="popup-notice-overlay"
    >

      <div class="popup-notice-overlay-dialog">

        <div class="popup-notice-overlay-dialog__body">
          <span style="font-size: 1.5em">{{ title }}</span><br>
          <!--
          <a
            href="#"
            target="_blank"
          >{{ $t('PopupOverlay.link') }}</a>
          -->
        </div>

        <div class="popup-notice-overlay-dialog__footer">
          <button
            @click="onCancel"
          >{{ $t('general.cancel') }}</button>
        </div>

      </div>

    </div>
  </transition>
</template>

<script>
export default {
  name: 'popup-notice-overlay',
  props: {
    isShow: {
      type: [Boolean, String],
      default: false,
    },
    isIosInApp: {
      type: [Boolean, String],
      default: false,
    },
  },
  computed: {
    title() {
      if (this.isIosInApp) {
        return this.$t('PopupOverlay.titleForIOSInApp');
      }
      return this.$t('PopupOverlay.title');
    },
  },
  methods: {
    onCancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style lang="scss">
@import "~assets/css/embed";

.popup-notice-overlay {
  position: fixed;
  z-index: 9999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.8);

  font-size: normalized(16);

  &-- {
    &enter-active,
    &leave-active {
      transition-property: transform, opacity;
    }
    &enter-active {
      transition-timing-function: ease-out;
      transition-duration: 0.25s;
    }
    &leave-active {
      transition-timing-function: ease-in;
      transition-duration: 0.15s;
    }

    &enter,
    &leave-to {
      transform: scale(0.8);

      opacity: 0;
    }
  }

  &-dialog {
    &__body {
      * + * {
        margin-top: 0.5em;
      }
    }

    &__footer {
      padding: 1.5em;
    }

    &#{&} {
      position: relative;

      padding: 1.5em;

      text-align: center;

      color: white;

      a {
        display: inline-block;

        color: white;
      }

      button {
        display: inline-block;

        min-height: 2em;
        margin: 0.5em;
        padding: 0 1em;

        transition: background-color 0.25s ease;

        color: white;
        border: 2px solid #ececec;
        background-color: #4a4a4a;

        font-size: 1em;

        &:hover {
          background-color: lighten(#4a4a4a, 15);
        }

        &:active {
          background-color: darken(#4a4a4a, 5);
        }
      }
    }
  }
}
</style>
