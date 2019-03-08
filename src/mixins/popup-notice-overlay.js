import PopupNoticeOverlay from '~/components/PopupNoticeOverlay';

import { checkIsIOSInApp } from '~/util/client';

export default {
  components: {
    PopupNoticeOverlay,
  },
  data() {
    return {
      isShowPopupNoticeOverlay: false,
      isIOSInApp: false,
    };
  },
  mounted() {
    this.$root.$on('openPopupNoticeOverlay', this.openPopupNoticeOverlay);
    this.$root.$on('closePopupNoticeOverlay', this.closePopupNoticeOverlay);

    this.isIOSInApp = checkIsIOSInApp();
  },
  beforeDestroy() {
    if (this.checkPopupWindowCloseTimer) {
      clearInterval(this.checkPopupWindowCloseTimer);
    }
  },
  methods: {
    openPopupNoticeOverlay(popupWindow) {
      this.popupWindow = popupWindow;
      this.isShowPopupNoticeOverlay = true;

      if (!this.isIOSInApp) {
        this.checkPopupWindowCloseTimer = setInterval(this.checkPopupWindowClose, 250);
      }
    },
    closePopupNoticeOverlay() {
      this.isShowPopupNoticeOverlay = false;

      if (this.checkPopupWindowCloseTimer) {
        clearInterval(this.checkPopupWindowCloseTimer);
      }
      this.checkPopupWindowCloseTimer = null;

      if (this.popupWindow && !this.popupWindow.closed) {
        this.popupWindow.close();
      }
      this.popupWindow = null;
    },

    checkPopupWindowClose() {
      if (!this.popupWindow || this.popupWindow.closed) {
        this.closePopupNoticeOverlay();
      }
    },
  },
};
