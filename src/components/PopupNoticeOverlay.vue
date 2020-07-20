<template>
  <transition name="popup-notice-overlay-">
    <div
      v-if="isShow"
      class="popup-notice-overlay"
    >

      <svg
        class="popup-notice-overlay-dialog"
        width="480"
        viewBox="0 0 480 240"
      >
        <foreignObject
          width="480"
          height="240"
        >
          <div
            :style="{
              width: '100%',
              height: '100%',
            }"
          >

            <div class="popup-notice-overlay-dialog__body">
              <i18n
                :path="titlePath"
                tag="span"
                style="font-size: 1.5em"
              >
                <br place="br">
              </i18n>
            </div>

            <div class="popup-notice-overlay-dialog__footer">
              <button
                @click="onCancel"
              >{{ $t('general.cancel') }}</button>
            </div>

          </div>
        </foreignObject>
      </svg>

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
    titlePath() {
      if (this.isIosInApp) {
        return 'PopupOverlay.titleForIOSInApp';
      }
      return 'PopupOverlay.title';
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

  font-size: 16px;

  &-- {
    &enter-active,
    &leave-active {
      transition-property: opacity;
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
