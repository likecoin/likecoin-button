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
};
</script>
