<template>
  <div class="lc-page-wrapper">

    <header class="lc-page-header">
      <div class="lc-page-header__left-section">
        <a @click="onClickBackButton">{{ $t('general.back') }}</a>
      </div>
    </header>

    <div class="lc-page-content">
      <div class="like-single-page">

        <h1 class="referrer-title">
          {{ referrerTitle }}
        </h1>

        <div class="like-panel">
          <div
            v-if="isLoading"
            class="like-panel__badge"
          >

            <div
              :style="contentStyle"
              class="text-content-wrapper"
            >
              <div
                v-bind="textContentProps"
              >
                <div class="text-content__subtitle">
                  {{ $t('general.loading') }}
                </div>
                <no-ssr>
                  <lc-loading-indicator />
                </no-ssr>
              </div>
            </div>
          </div>

          <LikeCoinButtonWidgetV2
            v-else
            :like-button-label="likeButtonLabel"
            :cta-button-preset="ctaButtonPreset"
            :style="{ textAlign: 'center' }"
            @click-like-button-label="onClickLikeStats"
            @click-cta-button="onClickCTAButton"
            :hint-label="hintText"
            :should-show-cta="hasSuperLiked"
            :cta-button-label="ctaButtonLabel"
          >
            <template #like-button>
              <LikeButton
                :id="id"
                :count="likeCount"
                :cooldown="cooldownProgress"
                :cooldown-end-time="nextSuperLikeTime"
                :has-super-liked="hasSuperLiked"
                :is-just-super-liked="isJustSuperLiked"
                :is-super-like-enabled="isSuperLiker"
                :is-creator="isCreator"
                @click="onClickLike"
                @click-disabled="onClickCooldown"
                @cooldown-end="updateSuperLikeStatus"
                ref="likeButton"
              />
            </template>
            <template #identity="identityProps">
              <Identity
                :avatarURL="avatar"
                :display-name="displayName"
                :is-avatar-button-outlined="isCreatorCivicLiker"
                v-bind="identityProps"
                @click-avatar="onClickAvatar"
                @click-display-name="onClickAvatar"
              />
            </template>
          </LikeCoinButtonWidgetV2>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import {
  apiGetPageTitle,
} from '@/util/api/api';

import { checkValidDomainNotIP, handleQueryStringInUrl } from '@/util/url';

import Identity from '~/components/Identity/Identity';
import LikeButton from '~/components/LikeButtonV2/LikeButtonV2';
import LikeCoinButtonWidgetV2 from '~/components/LikeCoinButtonWidgetV2/LikeCoinButtonWidgetV2';

import mixin from '~/mixins/embed';

import { checkIsMobileClient, checkIsTrustClient } from '~/util/client';
import { logTrackerEvent } from '@/util/EventLogger';
import {
  EXTERNAL_HOSTNAME,
  LIKECOIN_OEMBED_API_BASE,
  LIKER_LAND_URL_BASE,
} from '@/constant';

export default {
  components: {
    Identity,
    LikeButton,
    LikeCoinButtonWidgetV2,
  },
  mixins: [mixin],
  head() {
    return {
      title: this.$t('LikeButton.head.title', { name: this.displayName }),
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t('LikeButton.head.title', { name: this.displayName }),
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
          title: this.$t('LikeButton.head.title', { name: this.displayName }),
        },
        {
          rel: 'alternate',
          type: 'application/xml+oembed',
          href: `${LIKECOIN_OEMBED_API_BASE}?url=${this.encodedExternalURL}&format=xml`,
          title: this.$t('LikeButton.head.title', { name: this.displayName }),
        },
        { rel: 'preconnect', href: LIKER_LAND_URL_BASE },
      ],
    };
  },
  data() {
    return {
      referrerTitle: '',

      contentKey: 'loading',
      contentStyle: {
        height: '65px',
      },
    };
  },
  computed: {
    isLoading() {
      return this.contentKey === 'loading' || this.isRedirecting;
    },
    encodedExternalURL() {
      return encodeURIComponent(`https://${EXTERNAL_HOSTNAME}${this.$route.path}`);
    },
    textContentProps() {
      return {
        key: this.contentKey,
        ref: this.contentKey,
        class: 'text-content',
      };
    },
    ctaTitle() {
      if (this.isTrialSubscriber) {
        return this.$t('Embed.back.civicLiker.trial.title');
      }
      if (this.isSubscribed) {
        return this.$t('Embed.back.civicLiker.paid.title');
      }
      return this.$t('Embed.back.civicLiker.title');
    },
    ctaSubtitle() {
      if (this.isSubscribed && !this.isTrialSubscriber) {
        return '';
      }
      return this.$t('Embed.back.civicLiker.subtitle');
    },
    ctaButtonTitle() {
      if (this.isTrialSubscriber) {
        return this.$t('Embed.back.civicLiker.trial.button');
      }
      if (this.isSubscribed) {
        return this.$t('Embed.back.civicLiker.paid.button');
      }
      return this.$t('Embed.back.civicLiker.button');
    },
  },
  watch: {
    hasUpdateUserSignInStatus(value, prevValue) {
      if (value && !prevValue) {
        this.contentKey = 'loggedIn';
        switch (this.$route.query.action) {
          case 'like':
            if (
              (!this.isCreator && this.likeCount <= 0)
              && this.$refs.likeButton
            ) {
              // Click the LikeButton directly for clicking effect
              this.$nextTick(() => {
                if (this.$refs.likeButton) {
                  this.$refs.likeButton.onClick();
                }
              });
            }
            break;

          case 'save':
            if (!this.hasBookmarked) {
              this.onClickSaveButton();
            }
            break;

          default:
        }
      }
    },
  },
  asyncData(ctx) {
    return Promise.all([
      mixin.asyncData(ctx),
      (async () => {
        const { query } = ctx;
        let { referrer = '' } = query;
        if (referrer) {
          referrer = handleQueryStringInUrl(referrer);
        }
        const url = encodeURI(referrer);
        if (checkValidDomainNotIP(url)) {
          const referrerTitle = await apiGetPageTitle(referrer);
          return { referrerTitle };
        }
        return {};
      })(),
    ]).then(res => ({ ...res[0], ...res[1] }));
  },
  async mounted() {
    await this.updateUserSignInStatus();
    if (!this.isLoggedIn) {
      this.signUp({ isNewWindow: false });
      logTrackerEvent(this, 'LikeButtonFlow', 'popupSignUp', 'popupSignUp', 1);
    }
  },
  methods: {
    async doLike() {
      if (!this.isMaxLike && !this.isCreator) {
        this.like();
        logTrackerEvent(this, 'LikeButtonFlow', 'clickLike', 'clickLike(popup)', 1);
      } else if (this.canSuperLike) {
        await this.newSuperLike();
        await this.updateSuperLikeStatus();
      } else {
        this.showCivicLikerCTA();
      }
    },
    showCivicLikerCTA() {
      this.goToPortfolio({ type: 'self' });
      logTrackerEvent(this, 'LikeButtonFlow', 'clickCivicLikerCTA', 'clickCivicLikerCTA(popup)', 1);
    },
    onClickBackButton() {
      logTrackerEvent(this, 'LikeButtonFlow', 'clickBackButton', 'clickBackButton(popup)', 1);
      try {
        window.close();
        window.history.back();
      } catch (err) {
        console.error(err);
      }
    },
    onClickLike() {
      this.doLike();

      const isPaidSubscriber = this.isSubscribed && !this.isTrialSubscriber;
      if (
        this.isMaxLike
        && (
          !isPaidSubscriber
          || (isPaidSubscriber && (!checkIsMobileClient() || checkIsTrustClient()))
        )
      ) {
        this.contentKey = 'cta';
      }
    },
    onClickLikeStats() {
      this.openLikeStats({ isNewWindow: false });
      logTrackerEvent(this, 'LikeButtonFlow', 'clickLikeStats', 'clickLikeStats(popup)', 1);
    },
    onClickAvatar() {
      logTrackerEvent(this, 'LikeButtonFlow', 'clickAvatar', 'clickAvatar(popup)', 1);
      this.goToPortfolio();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/css/variables";

$badge-width: 485px;

.lc-page-header {
  position: relative;

  height: 52px;

  background-image: linear-gradient(251deg, #d2f0f0, #f0e6b4);

  &__left-section {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;

    display: flex;
    align-items: center;

    padding-left: 16px;

    a {
      font-size: 16px;
    }
  }
}

.referrer-title {
  margin-top: 40px;
  padding: 0 16px;

  text-align: center;

  color: $like-dark-brown-2;

  font-size: 24px;
  font-weight: 300;
  line-height: 28px;
}

.like-panel {
  padding: 0 12px;

  &__badge {
    display: flex;
    align-items: center;
    flex-direction: column;

    max-width: 270px;
    margin: 24px auto 0;

    text-align: center;

    border-radius: 8px;
    background-image: linear-gradient(78deg, #d2f0f0, #f0e6b4);
  }
}

.lc-loading-indicator {
  margin: 0 auto;

  color: $like-green;

  font-size: 14px;
}

.text-content {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  padding: 16px;

  &-wrapper {
    position: relative;

    overflow: hidden;

    width: 100%;

    transition: height 1s ease;
  }

  &-- {
    &enter-active,
    &leave-active {
      transition-duration: 1s;
      transition-property: opacity, transform;
    }

    &enter,
    &leave-to {
      transform: scale(0.7);

      opacity: 0;
    }
  }

  &__subtitle {
    font-size: 16px;
    line-height: 1.2;
  }

  &__title {
    font-size: 24px;
    line-height: 1.2;
  }
}

#embed-cta-button {
  margin-top: 8px;
}
</style>
