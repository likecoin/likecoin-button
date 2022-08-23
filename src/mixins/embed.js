import {
  isCookieEnabled,
  getCookie,
  setCookie,
} from 'tiny-cookie';

import {
  LIKE_CO_HOSTNAME,
  LIKER_LAND_URL_BASE,
  LIKECOIN_OEMBED_API_BASE,
  MEDIUM_MEDIA_REGEX,
  DEPUB_SPACE_URL,
} from '@/constant';

import EmbedCreateWidgetButton from '~/components/embed/EmbedCreateWidgetButton';
import EmbedUserInfo from '~/components/embed/EmbedUserInfo';
import { setTrackerUser, logTrackerEvent } from '@/util/EventLogger';

import {
  apiPostLikeButton,
  apiPostSuperLike,
  apiGetUserMinById,
  apiGetURLToISCNMapping,
  apiGetLikeButtonTotalCount,
  apiGetLikeButtonMyStatus,
  apiGetLikeButtonSelfCount,
  apiGetSuperLikeMyStatus,
  apiGetDataMinByIscnId,
  apiGetLikerDataByAddress,
  apiGetNFTMintInfo,
} from '~/util/api/api';

import { checkHasStorageAPIAccess, checkIsFirefoxStrictMode } from '~/util/client';
import { handleQueryStringInUrl } from '~/util/url';
import { isValidAddress, changeAddressPrefix, maskedWallet } from '~/util/cosmos';

const MAX_LIKE = 5;
const LIKE_STATS_WINDOW_NAME = 'LIKER_LIST_STATS_WINDOW';

const debounce = require('lodash.debounce');
const uuidv4 = require('uuid/v4');

const debouncedOnClick = debounce((that) => {
  /* eslint-disable no-param-reassign */
  const count = that.likeCount - that.likeSent;
  that.likeSent += count;
  if (count > 0) {
    apiPostLikeButton(that.likeTarget.id, count, {
      referrer: that.likeTarget.referrer,
      iscnId: that.likeTarget.iscnId,
      isCookieSupport: that.hasCookieSupport,
      ...that.apiMetadata,
    });
  }
  that.totalLike += count;
}, 500);

export default {
  components: {
    EmbedCreateWidgetButton,
    EmbedUserInfo,
  },
  head() {
    return {
      title: this.$t('LikeButton.head.title', { name: this.id }),
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t('LikeButton.head.title', { name: this.id }),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('LikeButton.head.description'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('LikeButton.head.description'),
        },
      ],
      link: [
        {
          rel: 'alternate',
          type: 'application/json+oembed',
          href: `${LIKECOIN_OEMBED_API_BASE}?url=${this.encodedExternalURL}&format=json`,
          title: this.$t('LikeButton.head.title', { name: this.id }),
        },
        {
          rel: 'alternate',
          type: 'application/xml+oembed',
          href: `${LIKECOIN_OEMBED_API_BASE}?url=${this.encodedExternalURL}&format=xml`,
          title: this.$t('LikeButton.head.title', { name: this.id }),
        },
      ],
    };
  },
  async asyncData({
    params,
    error,
    query,
    redirect,
  }) {
    let amount;
    try {
      const parse = parseInt(params.amount, 10);
      if (parse && !Number.isNaN(parse)) amount = parse;
    } catch (e) {
      // no op;
    }

    const { id } = params;
    let { type = '', iscn_id: iscnId } = query;
    const { referrer = '' } = query;
    if (!type && referrer.match(MEDIUM_MEDIA_REGEX)) {
      type = 'medium';
    }

    if (id !== 'iscn') {
      const mappingDataRes = await apiGetURLToISCNMapping(id, referrer).catch((err) => {
        console.error(err); // eslint-disable-line no-console
      });
      if (mappingDataRes && mappingDataRes.data) {
        // TODO: use iscnId instead of composing from prefix and id
        const { iscnPrefix, iscnVersion } = mappingDataRes.data;
        iscnId = `${iscnPrefix}/${iscnVersion}`;
      }

      if (!iscnId) {
        const data = await apiGetUserMinById(id).catch((err) => {
          console.error(err); // eslint-disable-line no-console
          error({ statusCode: 404, message: '' });
        });
        const {
          displayName,
          avatar,
          isPreRegCivicLiker,
          isCivicLikerTrial,
          isSubscribedCivicLiker,
          civicLikerSince,
        } = data.data;
        return {
          id,
          displayName: displayName || id,
          avatar,
          isPreRegCivicLiker,
          isCivicLikerTrial,
          isSubscribedCivicLiker,
          civicLikerSince,
          amount,
        };
      }
    }
    const [data, hasMintedNFT] = await Promise.all([
      apiGetDataMinByIscnId(iscnId).catch((err) => {
        console.error(err); // eslint-disable-line no-console
        error({ statusCode: 404, message: 'ISCN_NOT_FOUND' });
      }),
      apiGetNFTMintInfo({ iscnId })
        .then((res) => {
          if (res.data) {
            // Redirect to NFT Widget if the ISCN has been minted to an NFT
            redirect({ name: 'in-embed-nft', query: { ...query, iscn_id: iscnId } });
            return true;
          }
          return false;
        })
        .catch(() => false)
    ]);
    if (!data || hasMintedNFT) {
      return undefined;
    }

    const metadata = data && data.data.records[0].data.contentMetadata;
    const stakeholders = data && data.data.records[0].data.stakeholders;

    const stakeholdersFirstId = (stakeholders && stakeholders[0] && stakeholders[0].entity && stakeholders[0].entity['@id']) || '';
    let inputAddress = stakeholdersFirstId;
    const addressLengthWithoutPrefixAnd1 = 38;
    if (stakeholdersFirstId.startsWith('did:like:')) {
      inputAddress = `like1${stakeholdersFirstId.slice(stakeholdersFirstId.length - addressLengthWithoutPrefixAnd1)}`;
    } else if (inputAddress.startsWith('did:cosmos:')) {
      inputAddress = `cosmos1${stakeholdersFirstId.slice(stakeholdersFirstId.length - addressLengthWithoutPrefixAnd1)}`;
    }
    let stakeholdersValidlikeWallet;
    if (isValidAddress(inputAddress)) {
      stakeholdersValidlikeWallet = changeAddressPrefix(inputAddress, 'like');
    }
    let address;
    let stakeholdersName;
    if (stakeholdersValidlikeWallet) {
      address = stakeholdersValidlikeWallet;
      stakeholdersName = (stakeholders && stakeholders[0] && stakeholders[0].entity.name);
    } else {
      address = data && data.data && data.data.owner;
    }
    const likerData = await apiGetLikerDataByAddress(address)
      .catch(() => {});
    const displayName = (likerData && likerData.data && likerData.data.displayName) ||
    // stakeholdersName is only set if stakeholder wallet is used
    stakeholdersName ||
    maskedWallet(address);
    const avatar = (likerData && likerData.data && likerData.data.avatar) ||
    // Will use generative art in the future
    `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(iscnId)}.svg`;

    return {
      id,
      displayName,
      iscnId,
      amount,
      avatar,
      iscnName: metadata && (metadata.name || metadata.title),
    };
  },
  data() {
    return {
      isCreator: false,
      isLoggedIn: false,
      isSubscribed: false,
      isTrialSubscriber: false,
      civicLikerVersion: 0,

      like_count: 0,
      likeSent: 0,
      totalLike: 0,

      sessionId: uuidv4(),

      isSuperLiker: false,
      canSuperLike: false,
      hasSuperLiked: false,
      isJustSuperLiked: false,
      nextSuperLikeTime: -1,
      cooldownProgress: 0,
      hasClickCooldown: false,
      parentSuperLikeID: '',
      likerWallet: '',

      hasBookmarked: false,
      isLoadingBookmark: true,
      bookmarkID: undefined,

      hasFollowedCreator: false,
      isLoadingFollowStatus: false,

      supportingQuantity: 0,

      hasCookieSupport: false,
      hasStorageAPIAccess: false,

      hasUpdateUserSignInStatus: false,

      isRedirecting: false,
      ctaHref: DEPUB_SPACE_URL,
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
    buttonType() {
      const { query } = this.$route;
      const { type = '' } = query;
      return type;
    },
    integration() {
      const { query } = this.$route;
      const { integration = '' } = query;
      return integration;
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
    targetQueryString() {
      const { id, referrer, iscnId } = this;
      const referrerQuery = `${
        referrer ? `&referrer=${encodeURIComponent(referrer)}` : ''
      }`;
      if (iscnId) {
        return `?iscn_id=${encodeURIComponent(iscnId)}&utm_source=button`;
      }
      return `?=${encodeURIComponent(id)}${referrerQuery}&utm_source=button`;
    },

    signUpURL() {
      return `https://${LIKE_CO_HOSTNAME}/in/register${this.targetQueryString}&register=1&is_popup=1`;
    },
    superLikeURL() {
      const amountPath = `${this.amount ? `/${this.amount}` : ''}`;
      return `https://${LIKE_CO_HOSTNAME}/${this.id}${amountPath}${this.targetQueryString}`;
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
    timezoneString() {
      return ((new Date()).getTimezoneOffset() / -60).toString();
    },

    // UI Labels
    likeButtonLabel() {
      if (this.likeCount >= 5 && this.canSuperLike && this.cooldownProgress <= 0) {
        return this.$t('SuperLikeNow');
      }
      return this.$tc('LikeCountLabel', this.totalLike, { count: this.totalLike });
    },
    ctaButtonLabel() {
      return this.$t('CTA.CivicLiker.DepubSpace');
    },
    ctaButtonPreset() {
      return this.isSupportingCreator ? 'special' : 'default';
    },
    isCreatorCivicLiker() {
      return this.isCivicLikerTrial || this.isSubscribedCivicLiker;
    },
    isSupportingCreator() {
      return this.supportingQuantity > 0;
    },
    hintText() {
      if (!this.isLoggedIn) {
        return this.$t('HintLabel.SignIn');
      }
      if (this.isCreator) {
        if (this.cooldownProgress) {
          if (this.hasClickCooldown) {
            return this.$t('HintLabel.SuperLikedPleaseTryAgainLater');
          }
          if (this.hasSuperLiked) {
            return this.$t('HintLabel.SuperLikedFollowersWillSee');
          }
          return undefined;
        }
        if (this.canSuperLike) {
          return this.$t('HintLabel.CanSuperLikeOwn');
        }
        return this.$t('HintLabel.ToSuperLikeOwn');
      }
      if (this.likeCount < 5) {
        return this.$t('HintLabel.PleaseLike');
      }
      if (this.cooldownProgress) {
        if (this.hasClickCooldown) {
          return this.$t('HintLabel.SuperLikedPleaseTryAgainLater');
        }
        if (this.hasSuperLiked) {
          return this.$t('HintLabel.SuperLikedFollowersWillSee');
        }
        return undefined;
      }
      if (this.canSuperLike) {
        return this.$t('HintLabel.CanSuperLike');
      }
      return this.$t('HintLabel.ToSuperLike');
    },
    apiMetadata() {
      return {
        documentReferrer: this.documentReferrer,
        sessionID: this.sessionId,
        type: this.buttonType,
        integration: this.integration,
      };
    },

    creatorPortfolioURL() {
      let url = `${LIKER_LAND_URL_BASE}/${this.id}/civic?utm_source=button`;
      if (this.referrer) {
        url = `${url}&referrer=${encodeURIComponent(this.referrer)}`;
      }
      return url;
    },

    likeTarget() {
      if (this.iscnId) {
        return { id: 'iscn', referrer: '', iscnId: this.iscnId };
      }
      return { id: this.id, referrer: this.referrer, iscnId: '' };
    },
  },
  methods: {
    async getIsCookieSupport() {
      let res = false;
      try {
        this.hasStorageAPIAccess = await checkHasStorageAPIAccess();
        // Cross-site Cookie randomly disappear in fx strict mode
        const isFirefoxStrictMode = checkIsFirefoxStrictMode();
        res = process.client &&
          navigator.cookieEnabled &&
          this.hasStorageAPIAccess &&
          isCookieEnabled() &&
          !isFirefoxStrictMode;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        return false;
      }
      setCookie('likebutton_cookie', 1);
      return res;
    },
    getParentSuperLikeID() {
      if (!document.cookie || !isCookieEnabled()) return '';
      return getCookie('likebutton_superlike_id');
    },
    async updateSuperLikeStatus() {
      const { referrer, iscnId } = this.likeTarget;
      await apiGetSuperLikeMyStatus(this.timezoneString, { referrer, iscnId }).then(({ data }) => {
        const {
          isSuperLiker,
          canSuperLike,
          lastSuperLikeInfos,
          nextSuperLikeTs,
          cooldown,
          likeWallet,
        } = data;
        this.isSuperLiker = isSuperLiker;
        this.canSuperLike = canSuperLike;
        this.likerWallet = likeWallet;
        this.ctaHref = `${DEPUB_SPACE_URL}${this.likerWallet}`;
        // HACK: Assume if `hasSuperLiked` has set to `true`, don't override it as
        // `lastSuperLikeInfos` may return empty array even the Super Like action is success
        if (!this.hasSuperLiked) {
          this.hasSuperLiked = !!(lastSuperLikeInfos && lastSuperLikeInfos.length);
        }
        this.nextSuperLikeTime = nextSuperLikeTs;
        this.cooldownProgress = cooldown;
      });
      // TO-DO: handle updateSuperLikeStatus for ISCN
    },
    async updateUserSignInStatus() {
      const { id, referrer, iscnId } = this.likeTarget;
      try {
        await Promise.all([
          apiGetLikeButtonMyStatus(id, {
            referrer,
            iscnId,
            isCookieSupport: this.hasCookieSupport,
            ...this.apiMetadata,
          })
            .then(async ({ data: myData }) => {
              const {
                liker,
                isSubscribed,
                isTrialSubscriber,
                serverCookieSupported,
                civicLikerVersion,
                isSelfWork,
              } = myData;
              this.isLoggedIn = !!liker;
              this.isCreator = !!isSelfWork;
              this.isSubscribed = isSubscribed;
              this.isTrialSubscriber = isTrialSubscriber;
              this.civicLikerVersion = civicLikerVersion;
              if (
                this.hasCookieSupport &&
                serverCookieSupported !== undefined
              ) {
                this.hasCookieSupport = serverCookieSupported;
              }
              if (this.isLoggedIn) {
                if (this.$sentry) {
                  this.$sentry.configureScope((scope) => {
                    scope.setUser({ id: liker });
                  });
                }
                const promises = [
                  this.updateSuperLikeStatus(),
                  setTrackerUser({ user: liker }),
                ];
                await Promise.all(promises);
              }
              return Promise.resolve;
            }),
          apiGetLikeButtonSelfCount(id, {
            referrer,
            iscnId,
          }).then(
            ({ data: selfData }) => {
              const { count, liker } = selfData;
              if (!this.liker) {
                this.liker = liker;
                this.isLoggedIn = !!liker;
              }
              this.likeCount = count;
              this.likeSent = count;
            },
          ),
          apiGetLikeButtonTotalCount(id, {
            referrer,
            iscnId,
          }).then(
            ({ data: totalData }) => {
              const { total } = totalData;
              this.totalLike = total;
            },
          ),
        ]);
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      } finally {
        this.hasUpdateUserSignInStatus = true;
      }
    },
    signUp(options = { isNewWindow: true }) {
      if (options.isNewWindow) {
        const w = window.open(
          this.signUpURL,
          'signup',
          'width=540,height=600,menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes',
        );
        this.$root.$emit('openPopupNoticeOverlay', w);
      } else {
        window.location = `${this.signUpURL}&redirect=${encodeURIComponent(window.location.href)}`;
      }
      logTrackerEvent(this, 'LikeButtonFlow', 'triggerSignUpIn', 'triggerSignUpIn', 1);
    },

    like() {
      this.likeCount += 1;
      debouncedOnClick(this);
    },
    async newSuperLike() {
      const { referrer, iscnId } = this.likeTarget;
      const { cooldownProgress } = this;
      this.hasSuperLiked = true;
      this.isJustSuperLiked = true;
      this.cooldownProgress = 1;
      const address = await apiPostSuperLike(this.id, {
        referrer,
        iscnId,
        tz: this.timezoneString,
        ...this.apiMetadata,
      }).catch(() => {
        this.hasSuperLiked = false;
        this.cooldownProgress = cooldownProgress;
      });
      this.likerWallet = address.data.likerWallet;
      this.ctaHref = `${DEPUB_SPACE_URL}${this.likerWallet}`;
    },
    openLikeStats(options = { isNewWindow: true }) {
      const { id, referrer, iscnId } = this;
      if (options.isNewWindow) {
        window.open(
          `/in/embed/${id}/list${this.targetQueryString}`,
          LIKE_STATS_WINDOW_NAME,
          'menubar=no,location=no,width=576,height=768',
        );
      } else {
        this.$router.push({
          name: 'in-embed-id-list',
          params: { id },
          query: {
            referrer,
            iscn_id: iscnId,
            show_back: '1',
          },
        });
      }
    },
    onClickCTAButton() {
      const url = this.isSupportingCreator
        ? `${LIKER_LAND_URL_BASE}/${this.id}?civic_welcome=1`
        : `${LIKER_LAND_URL_BASE}/${this.id}/civic${this.targetQueryString}`;
      window.open(
        url,
        '_blank',
        'menubar=no,location=no,width=527,height=700',
      );
      // TO-DO: handle on click CTA to go depub.SPACE
    },
    onClickCooldown() {
      this.hasClickCooldown = true;
    },
    goToPortfolio({ type = 'popup', target = '_blank', feature = '' } = {}) {
      const url = this.creatorPortfolioURL;
      if (type === 'popup') {
        window.open(url, target, feature);
      } else {
        this.isRedirecting = true;
        window.location.href = url;
      }
      // TO-DO: handle go to portfolio
    },
  },
};
