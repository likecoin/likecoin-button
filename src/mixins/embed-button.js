import { LIKE_CO_HOSTNAME } from '@/constant';

import { getAvatarHaloTypeFromUser } from '~/util/user';
import { isAndroid, isFacebookBrowser } from '~/util/client';

import mixin from './embed';

export default {
  mixins: [mixin],
  data() {
    return {
      isUserFetched: false,
      isShowLikeButton: true,
    };
  },
  computed: {
    popupURL() {
      let url;
      if (this.iscnId) {
        url = `/in/like/iscn/?iscn_id=${this.iscnId}`;
      } else {
        url = `/in/like/${this.id}/?referrer=${encodeURIComponent(this.referrer)}`;
      }
      if (this.buttonType) url += `&type=${encodeURIComponent(this.buttonType)}`;
      return url;
    },
    isPreview() {
      return this.$route.query.preview === '1';
    },
  },
  head() {
    const link = [];
    if (this.isUserFetched && !this.isLoggedIn) {
      if (this.hasCookieSupport) {
        if (!(window.doNotTrack || navigator.doNotTrack)) { // do not prefetch if DNT
          link.push({ rel: 'prefetch', href: this.signUpURL });
        }
      } else {
        link.push({ rel: 'prefetch', href: this.popupURL });
      }
    }
    return {
      link,
    };
  },
  async mounted() {
    try {
      // Notify app when button is mounted
      window.top.postMessage({ action: 'MOUNTED' }, window.location.href);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    window.addEventListener('message', this.handleWindowMessage);
    if (this.isPreview) return;
    this.hasCookieSupport = await this.getIsCookieSupport();
    this.parentSuperLikeID = this.getParentSuperLikeID();
    await this.updateUserSignInStatus();
    if (this.onCheckCookieSupport) this.onCheckCookieSupport(this.hasCookieSupport);
    this.isUserFetched = true;
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleWindowMessage);
  },
  watch: {
    referrer() {
      this.updateUserSignInStatus();
    },
  },
  methods: {
    openPopup(action) {
      const popupURL = `${this.popupURL}&action=${action}`;
      if (isAndroid() && isFacebookBrowser()) {
        /* android fb iab stuck when open new window */
        try {
          window.top.location.href = popupURL;
          return;
        } catch (err) {
          console.error(err);
        }
      }
      const w = window.open(
        popupURL,
        'like',
        'menubar=no,location=no,width=576,height=768',
      );
      this.$root.$emit('openPopupNoticeOverlay', w);
    },
    async handleWindowMessage(event) {
      const { data } = event;
      if (typeof data !== 'object') return;

      /* public acitons */
      if (event.source === window.parent || event.source === window.top) {
        switch (data.action) {
          case 'SET_REFERRER': {
            const { referrer } = data.content;
            if (referrer === undefined) return;
            this.$router.replace({
              name: this.$route.name,
              params: this.$route.params,
              hash: this.$route.hash,
              query: { ...this.$route.query, referrer },
            });
            break;
          }
          case 'DISABLE_BUTTON': {
            this.isShowLikeButton = false;
            break;
          }
          default:
        }
      }

      /* private actions */
      if (event.origin === `https://${LIKE_CO_HOSTNAME}`) {
        switch (data.action) {
          case 'LOGGED_IN':
            await this.updateUserSignInStatus();

            // Do post sign in action after signing in
            switch (this.postSignInAction) {
              case 'like':
                this.$nextTick(() => {
                  if (this.$refs.likeButton) {
                    this.$refs.likeButton.onClick();
                  }
                });
                break;

              case 'save':
                if (!this.hasBookmarked) {
                  this.onClickSaveButton();
                }
                break;

              case 'follow':
                if (!this.hasFollowedCreator) {
                  this.onClickFollowButton();
                }
                break;

              default:
                break;
            }
            break;

          // For preview usage
          case 'PREVIEW': {
            if (!this.isPreview) return;

            const { user } = data.content;
            if (user) {
              if (user.user) this.id = user.user;
              if (user.displayName) this.displayName = user.displayName;
              if (user.avatar) this.avatar = user.avatar;
              this.avatarHalo = getAvatarHaloTypeFromUser(user);
            }
            break;
          }

          default:
        }
      }
    },
  },
};
