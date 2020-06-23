<template>
  <div>
    <nuxt />

    <no-ssr>
      <PopupNoticeOverlay
        :is-show="isShowPopupNoticeOverlay"
        :is-ios-in-app="isIOSInApp"
        @cancel="closePopupNoticeOverlay"
      />
    </no-ssr>
  </div>
</template>

<script>
import popupNoticeOverlayMixin from '~/mixins/popup-notice-overlay';

export default {
  mixins: [popupNoticeOverlayMixin],
  head() {
    return {
      htmlAttrs: {
        'likecoin-embed': undefined,
      },
    };
  },
};
</script>

<style lang="scss">
@import "~assets/css/embed";

$social-media-button-size: normalized(32);

html[likecoin-embed] {
  background-color: transparent !important;

  font-size: $full-width * 1px;

  @media screen and (max-width: $full-width * 1px) {
    font-size: 100vw;
  }

  body {
    background-color: transparent !important;
  }

  .likecoin-embed {
    position: relative;

    width: normalized();

    user-select: none;
  }

  .text-content {
    position: relative;

    flex-grow: 1;

    letter-spacing: 0;

    &__subtitle {
      color: $like-gray-5;

      font-size: normalized(16);
      font-weight: 500;
      line-height: normalized(16.5);
    }

    &__title {
      margin-top: normalized(2);

      color: black;

      font-size: normalized(18);
      font-weight: 600;
      line-height: normalized(18.5);
    }
  }

  footer {
    margin: 0;
    padding: 0;

    border: none;
  }

  button {
    padding: 0;

    border-color:transparent;
    outline-style:none;
    box-shadow:none;
  }
}
</style>
