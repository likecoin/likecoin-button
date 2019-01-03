<template>
  <div
    :class="[
      'likecoin-embed',
      'likecoin-embed--button',
      `likecoin-embed--logged-${isLoggedIn ? 'in' : 'out'}`,
      {
        'likecoin-embed--flipped': shouldShowBackside,
        'likecoin-embed--with-halo': avatarHalo !== 'none',
      },
    ]"
  >

    <transition
      name="likecoin-embed__badge-flip-"
      mode="out-in"
    >
      <div
        v-if="shouldShowBackside"
        key="back"
        class="likecoin-embed__badge likecoin-embed__badge--back"
      >
        <div class="likecoin-embed__badge__content">

          <div
            class="likecoin-embed__badge__close-btn"
            @click="onClickCloseButton"
          >
            <simple-svg
              :filepath="CloseButtonIcon"
              fill="currentColor"
              stroke="transparent"
            />
          </div>

          <div class="text-content">
            <!-- Super Like
            <i18n
              tag="div"
              class="text-content__subtitle"
              path="Embed.label.rewardUserWithLikeToken"
            >
              <a
                :href="getUserPath"
                place="user"
                rel="noopener noreferrer"
                target="_blank"
              >{{ displayName }}</a>
            </i18n>
            <div class="text-content__title text-content__title--amount">
              {{ amount }} LIKE
              <span class="amount-in-usd">= USD {{ amountInUSD }}</span>
            </div>
            -->

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
              :href="`https://${LIKE_CO_HOSTNAME}/in/civic?referrer=${encodeURIComponent(referrer)}&from=${encodeURIComponent($route.params.id)}`"
              target="_blank"
            >
              <div class="button-content-wrapper">
                <div class="button-content">
                  {{ $t('Embed.back.civicLiker.button') }}
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
                :href="getUserPath"
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

        </div>
      </div>
    </transition>

    <like-button
      :like-count="likeCount"
      :total-like="totalLike"
      :is-togglable="false"
      :is-max="isMaxLike"
      :is-show-max="shouldShowBackside"
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
  apiPostLikeButton,
  apiGetLikeButtonMyStatus,
  apiGetLikeButtonTotalCount,
} from '@/util/api/api';

import {
  LIKE_CO_HOSTNAME,
  CIVIC_LIKER_START_DATE,
} from '@/constant';
import { checkIsMobileClient } from '~/util/client';

import CloseButtonIcon from '~/assets/like-button/close-btn.svg';
import QuestionButtonIcon from '~/assets/like-button/question-btn.svg';

import mixin from '~/components/embed/mixin';
import LikeButton from '~/components/LikeButton';
import { logTrackerEvent } from '@/util/EventLogger';

const debounce = require('lodash.debounce');

const debouncedOnClick = debounce((that) => {
  /* eslint-disable no-param-reassign */
  const count = that.likeCount - that.likeSent;
  that.likeSent += count;
  if (count > 0) {
    apiPostLikeButton(that.id, that.referrer, count, that.getIsCookieSupport());
  }
  that.totalLike += count;
  /* eslint-enable no-param-reassign */
}, 500);

export default {
  name: 'embed-id-button',
  layout: 'embed',
  components: {
    LikeButton,
  },
  mixins: [mixin],
  data() {
    return {
      CloseButtonIcon,
      QuestionButtonIcon,

      LIKE_CO_HOSTNAME,

      isLoggedIn: false,
      likeCount: 0,
      likeSent: 0,
      totalLike: 0,
      shouldShowBackside: false,
    };
  },
  computed: {
    referrer() {
      return this.$route.query.referrer || document.referrer || '';
    },
    isMaxLike() {
      return (this.likeCount >= 5);
    },
    isMobile() {
      return checkIsMobileClient();
    },
    backTitle() {
      if (this.isSubscribedCivicLiker) {
        return this.$t('Embed.back.civicLiker.registered');
      }

      return this.$t(
        Date.now() < CIVIC_LIKER_START_DATE
          ? 'Embed.back.preRegister.title'
          : 'Embed.back.civicLiker.title',
      );
    },
    backSubtitle() {
      if (this.isSubscribedCivicLiker) {
        return '';
      }

      return this.$t(
        Date.now() < CIVIC_LIKER_START_DATE
          ? 'Embed.back.preRegister.subtitle'
          : 'Embed.back.civicLiker.subtitle',
      );
    },
  },
  mounted() {
    this.updateUser();
    window.addEventListener('message', this.handleWindowMessage);
    if (this.getIsCookieSupport()) {
      logTrackerEvent(this, 'LikeButton', 'isCookieSupportTrue', 'isCookieSupportTrue', 1);
    } else {
      logTrackerEvent(this, 'LikeButton', 'isCookieSupportFalse', 'isCookieSupportFalse', 1);
    }
  },
  beforeDestroy() {
    window.removeEventListener('message', this.handleWindowMessage);
  },
  methods: {
    getIsCookieSupport() {
      return /likecoin_cookie=true/.test(document.cookie);
    },
    async updateUser() {
      try {
        const [{ data: myData }, { data: totalData }] = await Promise.all([
          apiGetLikeButtonMyStatus(this.id, this.referrer, this.getIsCookieSupport()),
          apiGetLikeButtonTotalCount(this.id, this.referrer),
        ]);
        const { liker, count } = myData;
        const { total } = totalData;
        this.isLoggedIn = !!liker;
        this.totalLike = total;
        this.likeCount = count;
        this.likeSent = count;
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
    },
    onClickLoginButton() {
      logTrackerEvent(this, 'LikeButtonFlow', 'popupLikeButton', 'popupLikeButton', 1);
      if (this.getIsCookieSupport()) {
        // Case 1: User has not log in and 3rd party cookie is not blocked
        logTrackerEvent(this, 'LikeButtonFlow', 'popupSignUp', 'popupSignUp', 1);
        window.open(
          `https://${LIKE_CO_HOSTNAME}/in/register?referrer=${encodeURIComponent(this.referrer)}&from=${encodeURIComponent(this.$route.params.id)}`,
          'signin',
          'width=540,height=600,menubar=no,location=no,resizable=yes,scrollbars=yes,status=yes',
        );
      } else {
        // Case 2: User has not log in and 3rd party cookie is blocked
        logTrackerEvent(this, 'LikeButtonFlow', 'popupLike', 'popupLike', 1);
        const { id } = this.$route.params;
        window.open(
          `/in/like/${id}/?referrer=${encodeURIComponent(this.referrer)}`,
          'like',
          'menubar=no,location=no,width=576,height=768',
        );
      }
    },
    onClickLike() {
      if (this.isLoggedIn) {
        // Case 3: User has logged in
        if (!this.isMaxLike) {
          this.likeCount += 1;
          debouncedOnClick(this);
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
      const { id } = this.$route.params;
      const { referrer } = this.$route.query;
      window.open(
        `/in/embed/${id}/list${referrer ? `?referrer=${encodeURIComponent(referrer)}` : ''}`,
        '_blank',
        'menubar=no,location=no,width=576,height=768',
      );
      logTrackerEvent(this, 'LikeButtonFlow', 'clickLikeStats', 'clickLikeStats', 1);
    },
    onClickCloseButton() {
      this.shouldShowBackside = false;
    },
    onClickFrontDisplayName() {
      logTrackerEvent(this, 'LikeButtonFlow', 'clickFrontDisplayName', 'clickFrontDisplayName', 1);
    },
    handleWindowMessage(event) {
      if (event.origin !== `https://${LIKE_CO_HOSTNAME}`) return;
      if (event.data) {
        const { data } = event;
        switch (data.action) {
          case 'LOGGED_IN':
            this.updateUser().then(() => {
              // Click LikeButton after login
              this.$nextTick(() => {
                if (this.likeCount <= 0 && this.$refs.likeButton) {
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
      background: #e6e6e6;
    }

    &--back {
      margin-right: normalized($button-width / 2 + $button-shadow-width);

      .likecoin-embed__badge__content {
        padding-right: normalized($button-width / 2 + $button-shadow-width);
        padding-left: normalized($close-btn-width + 24);
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

      > div {
        width: normalized(28);
        height: normalized(28);

        color: $like-green;
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
