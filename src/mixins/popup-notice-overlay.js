import PopupNoticeOverlay from '~/components/PopupNoticeOverlay';

export default {
  components: {
    PopupNoticeOverlay,
  },
  data() {
    return {
      isShowPopupNoticeOverlay: false,
    };
  },
  mounted() {
    this.$root.$on('openPopupNoticeOverlay', this.openPopupNoticeOverlay);
    this.$root.$on('closePopupNoticeOverlay', this.closePopupNoticeOverlay);
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

      this.checkPopupWindowCloseTimer = setInterval(this.checkPopupWindowClose, 250);
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
