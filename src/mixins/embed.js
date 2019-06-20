import {
  LIKE_CO_HOSTNAME,
  LIKER_LAND_URL_BASE,
  MEDIUM_REGEX,
} from '@/constant';

import EmbedCreateWidgetButton from '~/components/embed/EmbedCreateWidgetButton';
import EmbedUserInfo from '~/components/embed/EmbedUserInfo';
import SocialMediaConnect from '~/components/SocialMediaConnect';
import { setTrackerUserId, logTrackerEvent } from '@/util/EventLogger';

import {
  apiPostLikeButton,
  apiGetUserMinById,
  apiGetSocialListById,
  apiGetLikeButtonTotalCount,
  apiGetLikeButtonMyStatus,
} from '~/util/api/api';

import { checkHasStorageAPIAccess } from '~/util/client';
import { getAvatarHaloTypeFromUser } from '~/util/user';
import { handleQueryStringInUrl } from '~/util/url';

const MAX_LIKE = 5;
const LIKE_STATS_WINDOW_NAME = 'LIKER_LIST_STATS_WINDOW';
const SUPER_LIKE_WINDOW_NAME = 'SUPER_LIKE_WINDOW';

const debounce = require('lodash.debounce');

const debouncedOnClick = debounce((that) => {
  /* eslint-disable no-param-reassign */
  const count = that.likeCount - that.likeSent;
  that.likeSent += count;
  if (count > 0) {
    apiPostLikeButton(
      that.id,
      that.referrer,
      count,
      that.hasCookieSupport,
      that.documentReferrer,
    );
  }
  that.totalLike += count;
  /* eslint-enable no-param-reassign */
}, 500);

export default {
  components: {
    EmbedCreateWidgetButton,
    EmbedUserInfo,
    SocialMediaConnect,
  },
  asyncData({
    params,
    error,
    query,
  }) {
    let amount;
    try {
      const parse = parseInt(params.amount, 10);
      if (parse && !Number.isNaN(parse)) amount = parse;
    } catch (e) {
      // no op;
    }

    const { id } = params;
    let { type = '' } = query;
    const { referrer = '' } = query;
    if (!type && referrer.match(MEDIUM_REGEX)) {
      type = 'medium';
    }

    return Promise.all([
      apiGetUserMinById(id),
      apiGetSocialListById(id, type).catch(() => ({})),
    ]).then((res) => {
      const {
        displayName,
        avatar,
        isPreRegCivicLiker,
        isSubscribedCivicLiker,
        civicLikerSince,
      } = res[0].data;

      return {
        id,
        displayName,
        avatar,
        avatarHalo: getAvatarHaloTypeFromUser(res[0].data),
        isPreRegCivicLiker,
        isSubscribedCivicLiker,
        civicLikerSince,
        amount,
        platforms: res[1].data,
      };
    }).catch((err) => {
      console.error(err); // eslint-disable-line no-console
      error({ statusCode: 404, message: '' });
    });
  },
  data() {
    return {
      isLoggedIn: false,
      isSubscribed: false,
      isTrialSubscriber: false,

      like_count: 0,
      likeSent: 0,
      totalLike: 0,

      hasCookieSupport: false,
      hasStorageAPIAccess: false,
    };
  },
  computed: {
    urlReferrer() {
      const { query } = this.$route;
      let { referrer = '' } = query;
      if (referrer) {
        referrer = handleQueryStringInUrl(referrer);
      }
      return referrer;
    },
    documentReferrer() {
      if (!process.client) return '';
      let windowReferrer = '';
      try {
        if (window.opener) {
          windowReferrer = (window.opener.document || {}).referrer;
        }
      } catch (err) {
        // no op
      }
      return windowReferrer || document.referrer || '';
    },
    referrer() {
      return this.urlReferrer || '';
    },
    referrerQueryString() {
      const { id, referrer } = this;
      const referrerQuery = `${referrer ? `&referrer=${encodeURIComponent(referrer)}` : ''}`;
      return `?from=${encodeURIComponent(id)}${referrerQuery}&utm_source=button`;
    },

    signInURL() {
      return `https://${LIKE_CO_HOSTNAME}/in/register${this.referrerQueryString}&is_popup=1`;
    },
    superLikeURL() {
      const amountPath = `${this.amount ? `/${this.amount}` : ''}`;
      return `https://${LIKE_CO_HOSTNAME}/${this.id}${amountPath}${this.referrerQueryString}`;
    },

    likeCount: {
      get() {
        return this.like_count;
      },
      set(value) {
        this.like_count = Math.min(MAX_LIKE, value);
      },
    },

    isMaxLike() {
      return this.likeCount >= MAX_LIKE;
    },
  },
  methods: {
    async getIsCookieSupport() {
      let res = false;
      try {
        this.hasStorageAPIAccess = await checkHasStorageAPIAccess();
        res = process.client
          && navigator.cookieEnabled
          && (document.cookie && /likecoin_cookie=true/.test(document.cookie))
          && this.hasStorageAPIAccess;
      } catch (err) {
        console.error(err);
        return false;
      }
      return res;
    },

    async updateUserSignInStatus() {
      try {
        const [{ data: myData }, { data: totalData }] = await Promise.all([
          apiGetLikeButtonMyStatus(this.id, this.referrer, this.hasCookieSupport),
          apiGetLikeButtonTotalCount(this.id, this.referrer),
        ]);
        const {
          liker,
          count,
          isSubscribed,
          isTrialSubscriber,
        } = myData;
        const { total } = totalData;
        this.isLoggedIn = !!liker;
        this.isSubscribed = isSubscribed;
        this.isTrialSubscriber = isTrialSubscriber;
        this.totalLike = total;
        this.likeCount = count;
        this.likeSent = count;
        if (liker) {
          if (this.$sentry) {
            this.$sentry.configureScope((scope) => {
              scope.setUser({ id: liker });
            });
          }
          await setTrackerUserId(liker);
        }
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
    },

    signIn(options = { isNewWindow: true }) {
      if (options.isNewWindow) {
        const w = window.open(
          this.signInURL,
          'signin',
          'width=540,height=600,menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes',
        );
        this.$root.$emit('openPopupNoticeOverlay', w);
      } else {
        window.location = `${this.signInURL}&redirect=${encodeURIComponent(window.location.href)}`;
      }
      logTrackerEvent(this, 'LikeButtonFlow', 'triggerSignUpIn', 'triggerSignUpIn', 1);
    },

    like() {
      this.likeCount += 1;
      debouncedOnClick(this);
    },
    superLike() {
      window.open(
        this.superLikeURL,
        SUPER_LIKE_WINDOW_NAME,
        'menubar=no,location=no,width=600,height=768',
      );
    },

    openLikeStats(options = { isNewWindow: true }) {
      const { id, referrer } = this;
      if (options.isNewWindow) {
        window.open(
          `/in/embed/${id}/list${this.referrerQueryString}`,
          LIKE_STATS_WINDOW_NAME,
          'menubar=no,location=no,width=576,height=768',
        );
      } else {
        this.$router.push({
          name: 'in-embed-id-list',
          params: { id },
          query: {
            referrer,
            show_back: '1',
          },
        });
      }
    },
    convertLikerToCivicLiker() {
      window.open(
        `${LIKER_LAND_URL_BASE}/civic${this.isTrialSubscriber ? '/register' : ''}${this.referrerQueryString}`,
        '_blank',
      );
    },
  },
};
