import {
  LIKE_CO_HOSTNAME,
  MEDIUM_REGEX,
} from '@/constant';

import EmbedCreateWidgetButton from '~/components/embed/EmbedCreateWidgetButton';
import EmbedUserInfo from '~/components/embed/EmbedUserInfo';
import SocialMediaConnect from '~/components/SocialMediaConnect';

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
  if (count > 0) apiPostLikeButton(that.id, that.referrer, count, that.hasCookieSupport);
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
    referrer() {
      return this.urlReferrer || (process.client && document.referrer) || '';
    },
    referrerQueryString() {
      const { id, referrer } = this;
      const referrerQuery = `${referrer ? `&referrer=${encodeURIComponent(referrer)}` : ''}`;
      return `?from=${encodeURIComponent(id)}${referrerQuery}`;
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
      const res = process.client && navigator.cookieEnabled && await checkHasStorageAPIAccess();
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
        if (this.$sentry) {
          this.$sentry.configureScope((scope) => {
            scope.setUser({ id: liker });
          });
        }
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
    },

    signIn(options = { isNewWindow: true }) {
      if (options.isNewWindow) {
        window.open(
          this.signInURL,
          'signin',
          'width=540,height=600,menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes',
        );
      } else {
        window.location = `${this.signInURL}&redirect=${encodeURIComponent(window.location.href)}`;
      }
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
        `https://${LIKE_CO_HOSTNAME}/in/civic${this.isTrialSubscriber ? '/register' : ''}${this.referrerQueryString}`,
        '_blank',
      );
    },
  },
};
