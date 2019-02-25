<template>
  <div
    :class="[
      'likecoin-embed',
      'likecoin-embed--button',
      `likecoin-embed--logged-${isLoggedIn ? 'in' : 'out'}`,
      {
        'likecoin-embed--flipped': isFlipped,
        'likecoin-embed--with-halo': avatarHalo !== 'none',
      },
    ]"
  >

    <transition
      name="likecoin-embed__badge-flip-"
      mode="out-in"
    >
      <div
        v-if="isFlipped"
        key="back"
        class="likecoin-embed__badge likecoin-embed__badge--back"
      >
        <div class="likecoin-embed__badge__content">

          <!-- Don't show close button-->
          <div
            v-if="false"
            class="likecoin-embed__badge__close-btn"
            @click="onClickCloseButton"
          >
            <close-button-icon />
          </div>

          <div class="text-content">

            <div
              v-if="backSubtitle"
              class="text-content__subtitle"
            >
              {{ backSubtitle }}
            </div>
            <div class="text-content__title text-content__title--civic-liker">
              {{ backTitle }}
            </div>

          </div>

          <div class="embed-cta-button-wrapper">
            <a
              id="embed-cta-button"
              @click="onClickBackCTAButton"
            >
              <div class="button-content-wrapper">
                <div class="button-content">
                  {{ backCTAButtonTitle }}
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div
        v-else
        key="front"
        class="likecoin-embed__badge likecoin-embed__badge--front"
      >
        <div class="likecoin-embed__badge__content">

          <embed-user-info
            :avatar="avatar"
            :avatar-halo="avatarHalo"
            @click-avatar="onClickAvatar"
            @click-avatar-halo="onClickAvatarHalo"
          />

          <!-- Front upper part, Logged in -->
          <!-- Mobile -->
          <div
            v-if="isLoggedIn || isMobile"
            class="text-content"
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
                @click="onClickFrontDisplayName"
              >{{ displayName }}</a>
            </i18n>
          </div>
          <!-- Front upper part, Logged out -->
          <div
            v-else
            class="text-content"
          >
            <i18n
              tag="div"
              class="text-content__subtitle"
              path="Embed.label.clickLikeButtonNoLogin"
            >
              <a
                place="action"
                @click.prevent="onClickLoginButton"
              >{{ $t('Embed.label.registerNow') }}</a>
            </i18n>
            <i18n
              tag="div"
              class="text-content__title"
              path="Embed.label.supportUserNoLogin"
            >
              <span
                place="user"
              >{{ displayName }}</span>
            </i18n>
          </div>

          <div
            v-if="!isLoggedIn"
            class="embed-cta-button-wrapper"
          >
            <a
              id="embed-cta-button"
              @click="onClickLoginButton"
            >
              <div class="button-content-wrapper">
                <div class="button-content">
                  {{ $t('Embed.label.registerNow') }}
                </div>
              </div>
            </a>
          </div>

        </div>
      </div>
    </transition>

    <like-button
      ref="likeButton"
      :like-count="likeCount"
      :total-like="totalLike"
      :is-togglable="false"
      :is-max="isMaxLike"
      :is-show-max="isFlipped"
      @like="onClickLike"
      @click-stats="onClickLikeStats"
    />

    <footer>
      <social-media-connect
        :username="id"
        :platforms="platforms"
        :limit="5"
      />
    </footer>

  </div>
</template>

<script>
import {
  LIKE_CO_HOSTNAME,
} from '@/constant';
import { checkIsMobileClient, checkHasStorageAPIAccess } from '~/util/client';

import CloseButtonIcon from '~/assets/like-button/close-btn.svg';

import mixin from '~/mixins/embed';
import LikeButton from '~/components/LikeButton';
import { logTrackerEvent } from '@/util/EventLogger';

export default {
  name: 'embed-id-button',
  layout: 'embed',
  components: {
    LikeButton,
    CloseButtonIcon,
  },
  mixins: [mixin],
  data() {
    return {
      isShowPopupAlert: false,
      shouldShowBackside: false,
      isUserFetched: false,
    };
  },
  computed: {
    popupLikeURL() {
      const { id } = this.$route.params;
      return `/in/like/${id}/?referrer=${encodeURIComponent(this.referrer)}`;
    },
    isMobile() {
      return checkIsMobileClient();
    },
    isFlipped() {
      return this.shouldShowBackside;
    },
    backTitle() {
      if (this.isTrialSubscriber) {
        return this.$t('Embed.back.civicLiker.trial.title');
      }
      if (this.isSubscribed) {
        return this.$t('Embed.back.civicLiker.paid.title');
      }
      return this.$t('Embed.back.civicLiker.title');
    },
    backSubtitle() {
      if (this.isSubscribed && !this.isTrialSubscriber) {
        return '';
      }
      return this.$t('Embed.back.civicLiker.subtitle');
    },
    backCTAButtonTitle() {
      if (this.isTrialSubscriber) {
        return this.$t('Embed.back.civicLiker.trial.button');
      }
      if (this.isSubscribed) {
        return this.$t('Embed.back.civicLiker.paid.button');
      }
      return this.$t('Embed.back.civicLiker.button');
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
    this.isUserFetched = false;
    window.addEventListener('message', this.handleWindowMessage);
    this.hasCookieSupport = await this.getIsCookieSupport();
    await this.updateUserSignInStatus();
    if (this.hasCookieSupport) {
      logTrackerEvent(this, 'LikeButton', 'isCookieSupportTrue', 'isCookieSupportTrue', 1);
    } else {
      logTrackerEvent(this, 'LikeButton', 'isCookieSupportFalse', 'isCookieSupportFalse', 1);
    }
    this.isUserFetched = true;
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleWindowMessage);
  },
  methods: {
    async getIsCookieSupport() {
      const res = process.client && navigator.cookieEnabled && await checkHasStorageAPIAccess();
      return res;
    },
    onClickLoginButton() {
      logTrackerEvent(this, 'LikeButtonFlow', 'popupLikeButton', 'popupLikeButton', 1);
      if (this.hasCookieSupport) {
        // Case 1: User has not log in and 3rd party cookie is not blocked
        this.signIn();
        logTrackerEvent(this, 'LikeButtonFlow', 'popupSignUp', 'popupSignUp', 1);
      } else {
        // Case 2: User has not log in and 3rd party cookie is blocked
        window.open(
          this.popupLikeURL,
          'like',
          'menubar=no,location=no,width=576,height=768',
        );
        logTrackerEvent(this, 'LikeButtonFlow', 'popupLike', 'popupLike', 1);
      }
    },
    onClickLike() {
      if (this.isLoggedIn) {
        // Case 3: User has logged in
        if (!this.isMaxLike) {
          this.like();
          logTrackerEvent(this, 'LikeButtonFlow', 'clickLike', 'clickLike', 1);
        }

        if (this.isMaxLike) {
          this.shouldShowBackside = true;
        }
      } else {
        this.onClickLoginButton();
      }
    },
    onClickLikeStats() {
      this.openLikeStats();
      logTrackerEvent(this, 'LikeButtonFlow', 'clickLikeStats', 'clickLikeStats', 1);
    },
    onClickCloseButton() {
      this.shouldShowBackside = false;
    },
    onClickFrontDisplayName() {
      logTrackerEvent(this, 'LikeButtonFlow', 'clickFrontDisplayName', 'clickFrontDisplayName', 1);
    },
    onClickBackCTAButton() {
      if (this.isSubscribed && !this.isTrialSubscriber) {
        this.superLike();
      } else {
        this.convertLikerToCivicLiker();
      }
    },
    onClickAvatar() {
      this.superLike();
    },
    onClickAvatarHalo() {
      this.convertLikerToCivicLiker();
    },
    handleWindowMessage(event) {
      if (event.origin !== `https://${LIKE_CO_HOSTNAME}`) return;
      if (event.data) {
        const { data } = event;
        switch (data.action) {
          case 'LOGGED_IN':
            this.updateUserSignInStatus().then(() => {
              // Click LikeButton after login
              this.$nextTick(() => {
                if (this.$refs.likeButton) {
                  this.$refs.likeButton.onPressedKnob();
                }
              });
            });
            break;

          default:
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/css/embed";

$close-btn-width: 56;

.likecoin-embed {
  perspective: 800px;

  &#{&}--with-halo {
    margin-top: normalized(24);
  }

  &__badge {
    backface-visibility: hidden;
    transform-style: preserve-3d;

    .likecoin-embed--logged-out & {
      background: linear-gradient(70deg, #e6e6e6 60%, #d2f0f0, #f0e6b4);
    }

    &--front {
      .likecoin-embed--logged-out & {
        margin-right: normalized($button-width / 2 + $button-shadow-width);
      }
    }

    &--back {
      margin-right: normalized($button-width / 2 + $button-shadow-width);

      .text-content {
        padding-left: normalized(24);
      }
    }

    &-flip-- {
      &enter-active,
      &leave-active {
        transition-property: opacity, transform;
      }
      &enter-active {
        transition-timing-function: ease-out;
        transition-duration: 0.3s;
      }
      &leave-active {
        transition-timing-function: ease-in;
        transition-duration: 0.2s;
      }
      &enter {
        transform: translateZ(normalized(-100)) rotateX(-90deg);
      }
      &leave-to {
        transform: translateZ(normalized(-100)) rotateX(90deg);
      }
    }

    &__close-btn {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      width: normalized($close-btn-width);

      cursor: pointer;

      transition: background-color 0.2s ease;

      border-top-left-radius: $badge-border-radius;
      border-bottom-left-radius: $badge-border-radius;

      background-color: rgba(white, 0.5);

      &:hover:not(:active) {
        background-color: rgba(white, 0.7);
      }

      > svg {
        width: normalized(28);
        height: normalized(28);

        fill: $like-green;
      }

      & + .text-content {
        padding-left: normalized($close-btn-width + 24);
      }
    }
  }

  &__badge--front,
  footer {
    margin-right: normalized($button-border-width + $button-shadow-width);
  }
}

#embed-cta-button {
  @keyframes super-like-button-shake {
    0%, 86% { transform: rotateZ(0deg); }
    88% { transform: rotateZ(2deg); }
    90% { transform: rotateZ(-2deg); }
    92% { transform: rotateZ(3deg); }
    94% { transform: rotateZ(-3deg); }
    98% { transform: rotateZ(1deg); }
    100% { transform: rotateZ(0deg); }
  }
  animation-name: super-like-button-shake;
  animation-duration: 3s;
  animation-timing-function: ease-out;
  animation-delay: -2s;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
}

.text-content {
  &__title {
    &#{&}--amount {
      color: $like-green;

      .amount-in-usd {
        margin-left: normalized(6);

        color: $like-gray-5;

        font-size: normalized(10);
        line-height: normalized(10.5);
      }
    }

    &#{&}--civic-liker {
      font-size: normalized(24);
      line-height: normalized(24.5);
    }
  }
}

.login-tooltip {
  position: absolute;
  right: 0;

  margin-right: normalized(12);

  > div {
    position: relative;
  }

  &__trigger {
    display: block;

    width: normalized(16);
    height: normalized(16);

    transition-timing-function: ease;
    transition-duration: 0.25s;
    transition-property: transform, background, color;

    border: none;
    border-radius: 50%;

    @media screen and (max-width: 414px) {
      width: normalized(18);
      height: normalized(18);
    }

    &--flip- {
      &enter-active {
        transition-timing-function: ease-out;
        transition-duration: 0.15s;
      }
      &leave-active {
        transition-timing-function: ease-in;
        transition-duration: 0.05s;
      }
      &enter,
      &leave-to {
        transform: scale(0);
      }
    }

    &--open {
      color: #9b9b9b;
      background: none;

      &:hover {
        color: darken(#9b9b9b, 10);
      }
      &:active {
        color: darken(#9b9b9b, 20);
      }
    }

    &--close {
      color: white;
      background: $like-green;

      &:hover {
        color: darken(white, 20);
        background: darken($like-green, 5);
      }
      &:active {
        color: darken(white, 50);
        background: darken($like-green, 15);
      }
    }

    > div {
      width: inherit;
      height: inherit;
    }
  }

  &__bubble {
    &-wrapper {
      position: absolute;
      top: 50%;
      right: calc(100% + #{normalized(4.5)});

      transform: translateY(-50%);
    }

    position: relative;

    width: normalized(208);

    margin-right: normalized(8);
    padding: normalized(8) normalized(12);

    transform-origin: center right;

    color: #9b9b9b;

    border-radius: normalized(6);
    background-color: white;

    font-size: normalized(10);
    line-height: normalized(14);

    @media screen and (max-width: 414px) {
      width: normalized(260);

      font-size: normalized(12);
      line-height: normalized(16);
    }

    &--pop-up- {
      &enter-active {
        transition-timing-function: ease-out;
        transition-duration: 0.2s;
      }
      &leave-active {
        transition-timing-function: ease-in;
        transition-duration: 0.1s;
      }
      &enter,
      &leave-to {
        transform: scale(0);
      }
    }

    // Triangle
    &::before {
      position: absolute;
      top: 50%;
      left: 100%;

      width: 0;
      height: 0;

      content: '';

      transform: translateY(-50%);

      border-top: normalized(8) solid transparent;
      border-bottom: normalized(8) solid transparent;
      border-left: normalized(8) solid white;
    }

    a {
      text-decoration: underline;

      font-weight: 600;
    }
  }
}

.like-button {
  position: absolute;

  margin-top: normalized(-18);
  margin-left: normalized(44);
}

.social-media-connect {
  transition: opacity 0.3s ease;

  .likecoin-embed--flipped & {
    pointer-events: none;

    opacity: 0;
  }
}
</style>
