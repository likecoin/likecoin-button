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
          <div class="like-panel__badge">

            <div
              :style="contentStyle"
              class="text-content-wrapper"
            >
              <transition
                @enter="setContentHeight"
                name="text-content-"
              >
                <!-- Loading -->
                <div
                  v-if="contentKey === 'loading'"
                  v-bind="textContentProps"
                >
                  <div class="text-content__subtitle">
                    {{ $t('general.loading') }}
                  </div>
                  <no-ssr>
                    <lc-loading-indicator />
                  </no-ssr>
                </div>

                <!-- Logged In -->
                <div
                  v-else-if="contentKey === 'loggedIn'"
                  v-bind="textContentProps"
                >
                  <div class="text-content__subtitle">
                    {{ $t('Embed.label.clickLikeButton') }}
                  </div>
                  <i18n
                    tag="div"
                    class="text-content__title"
                    path="Embed.label.supportUser"
                  >
                    <a
                      :href="superLikeURL"
                      place="user"
                      rel="noopener noreferrer"
                      target="_blank"
                    >{{ displayName }}</a>
                  </i18n>
                </div>

                <!-- Max Liked -->
                <div
                  v-else-if="contentKey === 'cta'"
                  v-bind="textContentProps"
                >
                  <div
                    v-if="ctaSubtitle"
                    class="text-content__subtitle"
                  >
                    {{ ctaSubtitle }}
                  </div>
                  <div class="text-content__title text-content__title--civic-liker">
                    {{ ctaTitle }}
                  </div>

                  <a
                    @click="onClickCTAButton"
                    id="embed-cta-button"
                  >
                    <div class="button-content-wrapper">
                      <div class="button-content">
                        {{ ctaButtonTitle }}
                      </div>
                    </div>
                  </a>
                </div>

              </transition>
            </div>
          </div>

          <LikeCoinButtonWidget
            :like-button-label="likeButtonLabel"
            :save-button-label="saveButtonLabel"
            :avatar-label="avatarLabel"
            :style="{ textAlign: 'center' }"
          >
            <template #like-button>
              <LikeButton
                :count="likeCount"
                :cooldown="cooldownProgress"
                :has-super-liked="hasSuperLiked"
                :is-super-like-enabled="canSuperLike"
                @click="onClickLike"
                ref="likeButton"
              />
            </template>

            <template #save-button="saveButtonProps">
              <SaveButton
                v-bind="saveButtonProps"
                :toggled="hasBookmarked"
                @click="onClickSaveButton"
              />
            </template>

            <template #identity="identityProps">
              <Identity
                :avatarURL="avatar"
                :display-name="displayName"
                v-bind="identityProps"
                @click-avatar="onClickFollow"
              />
            </template>
          </LikeCoinButtonWidget>

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
import LikeCoinButtonWidget from '~/components/LikeCoinButtonWidget/LikeCoinButtonWidget';
import SaveButton from '~/components/SaveButton/SaveButton';

import mixin from '~/mixins/embed';

import { checkIsMobileClient, checkIsTrustClient } from '~/util/client';
import { logTrackerEvent } from '@/util/EventLogger';

export default {
  components: {
    Identity,
    LikeButton,
    LikeCoinButtonWidget,
    SaveButton,
  },
  mixins: [mixin],
  data() {
    return {
      referrerTitle: '',

      contentKey: 'loading',
      contentStyle: {
        height: '65px',
      },
    };
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
  computed: {
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
  async mounted() {
    this.resizeListener = window.addEventListener('resize', this.setContentHeight);

    await this.updateUserSignInStatus();
    if (!this.isLoggedIn) {
      this.signUp({ isNewWindow: false });
      logTrackerEvent(this, 'LikeButtonFlow', 'popupSignUp', 'popupSignUp', 1);
      return;
    }

    this.contentKey = 'loggedIn';
    this.$nextTick(() => {
      this.setContentHeight();

      if (this.likeCount <= 0 && this.$refs.likeButton) {
        this.$refs.likeButton.onClick();
      }
    });
  },
  beforeDestroy() {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.setContentHeight);
    }
  },
  methods: {
    setContentHeight() {
      const elem = this.$refs[this.contentKey];
      if (elem) {
        this.contentStyle = {
          height: `${elem.offsetHeight}px`,
        };
      }
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
      logTrackerEvent(this, 'LikeButtonFlow', 'clickLike', 'clickLike(popup)', 1);
      if (!this.isMaxLike) {
        this.like();
      }

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
    onClickCTAButton() {
      logTrackerEvent(this, 'LikeButtonFlow', 'clickCTA', 'clickCTA(popup)', 1);
      if (this.isSubscribed && !this.isTrialSubscriber) {
        logTrackerEvent(this, 'LikeButtonFlow', 'clickSuperLike', 'clickSuperLike(popup)', 1);
        this.superLike();
      } else {
        logTrackerEvent(this, 'LikeButtonFlow', 'clickConvertCivicLiker', 'clickConvertCivicLiker(popup)', 1);
        this.convertLikerToCivicLiker();
      }
    },
    onClickSaveButton() {
      logTrackerEvent(this, 'LikeButtonFlow', 'clickSaveButton', 'clickSaveButton(popup)', 1);
      this.toggleBookmark();
    },
    onClickFollow() {
      logTrackerEvent(this, 'LikeButtonFlow', 'clickFollowButton', 'clickFollowButton(popup)', 1);
      this.toggleFollow();
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
