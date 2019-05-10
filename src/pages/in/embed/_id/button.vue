<template>
  <div :class="rootClass">

    <!-- BEGIN - Version 2 -->
    <template v-if="version === 2">
      Test
    </template>
    <!-- END - Version 2 -->

    <!-- BEGIN - Version 1 -->
    <template v-else>
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
              @click="onClickCloseButton"
              class="likecoin-embed__badge__close-btn"
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
                @click="onClickBackCTAButton"
                id="embed-cta-button"
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
                  @click="onClickFrontDisplayName"
                  place="user"
                  rel="noopener noreferrer"
                  target="_blank"
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
                  :href="popupLikeURL"
                  @click="onClickLoginButton"
                  place="action"
                  target="_blank"
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
                :href="popupLikeURL"
                @click="onClickLoginButton"
                id="embed-cta-button"
                target="_blank"
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
        :like-count="likeCount"
        :total-like="totalLike"
        :is-togglable="false"
        :is-max="isMaxLike"
        :is-show-max="isFlipped"
        :href="popupLikeURL"
        @like="onClickLike"
        @click-stats="onClickLikeStats"
        ref="likeButton"
      />

      <footer>
        <social-media-connect
          :username="id"
          :platforms="platforms"
          :limit="5"
        />
      </footer>
    </template>
    <!-- END - Version 1 -->

  </div>
</template>

<script>
import { checkIsMobileClient } from '~/util/client';

import CloseButtonIcon from '~/assets/like-button/close-btn.svg';

import mixin from '~/mixins/embed-button';
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
      shouldShowBackside: false,
      isUserFetched: false,
    };
  },
  computed: {
    version: () => 1,
    isMobile() {
      return checkIsMobileClient();
    },
    isFlipped() {
      return this.shouldShowBackside;
    },
    rootClass() {
      return [
        'likecoin-embed',
        'likecoin-embed--button',
        `likecoin-emded--button-v${this.version}`,
        `likecoin-embed--logged-${this.isLoggedIn ? 'in' : 'out'}`,
        {
          'likecoin-embed--flipped': this.isFlipped,
          'likecoin-embed--with-halo': this.avatarHalo !== 'none',
        },
      ];
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
  methods: {
    onCheckCookieSupport(isSupport) {
      if (isSupport) {
        logTrackerEvent(this, 'LikeButton', 'isCookieSupportTrue', 'isCookieSupportTrue', 1);
      } else {
        logTrackerEvent(this, 'LikeButton', 'isCookieSupportFalse', 'isCookieSupportFalse', 1);
      }
    },
    onClickLoginButton(e) {
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }

      logTrackerEvent(this, 'LikeButtonFlow', 'popupLikeButton', 'popupLikeButton', 1);
      if (this.hasCookieSupport) {
        // Case 1: User has not log in and 3rd party cookie is not blocked
        this.signIn();
        logTrackerEvent(this, 'LikeButtonFlow', 'popupSignUp', 'popupSignUp', 1);
      } else {
        // Case 2: User has not log in and 3rd party cookie is blocked
        this.popupLike();
        logTrackerEvent(this, 'LikeButtonFlow', 'popupLike', 'popupLike', 1);
      }
    },
    onClickLike(e) {
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
        this.onClickLoginButton(e);
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
  },
};
</script>

<style lang="scss">
@import "~assets/css/embed";

$close-btn-width: 56;

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

.likecoin-embed {
  perspective: 800px;

  &--with-halo {
    margin-top: normalized(24) !important;
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
}
</style>
