import {
  LIKE_CO_HOSTNAME,
} from '@/constant';
import mixin from './embed';

export default {
  mixins: [mixin],
  data() {
    return {
      isUserFetched: false,
    };
  },
  computed: {
    popupLikeURL() {
      return `/in/like/${this.id}/?referrer=${encodeURIComponent(this.referrer)}`;
    },
  },
  head() {
    const link = [];
    if (this.isUserFetched && !this.isLoggedIn) {
      if (this.hasCookieSupport) {
        if (!(window.doNotTrack || navigator.doNotTrack)) { // do not prefetch if DNT
          link.push({ rel: 'prefetch', href: this.signInURL });
        }
      } else {
        link.push({ rel: 'prefetch', href: this.popupLikeURL });
      }
    }
    return {
      link,
    };
  },
  async mounted() {
    window.addEventListener('message', this.handleWindowMessage);
    this.hasCookieSupport = await this.getIsCookieSupport();
    await this.updateUserSignInStatus();
    if (this.onCheckCookieSupport) this.onCheckCookieSupport(this.hasCookieSupport);
    this.isUserFetched = true;
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleWindowMessage);
  },
  methods: {
    popupLike() {
      const w = window.open(
        this.popupLikeURL,
        'like',
        'menubar=no,location=no,width=576,height=768',
      );

      this.$root.$emit('openPopupNoticeOverlay', w);
    },

    async handleWindowMessage(event) {
      if (event.origin !== `https://${LIKE_CO_HOSTNAME}`) return;
      if (event.data) {
        const { data } = event;
        switch (data.action) {
          case 'LOGGED_IN':
            await this.updateUserSignInStatus();
            // Click LikeButton after signing in
            this.$nextTick(() => {
              if (this.$refs.likeButton) {
                this.$refs.likeButton.onPressedKnob();
              }
            });
            break;

          default:
        }
      }
    },
  },
};
