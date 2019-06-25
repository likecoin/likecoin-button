<template lang="pug">
  mixin LikeButton(isShowTotalLike="true")
    LikeButton(
      ref="likeButton"
      :version="version"
      :like-count="likeCount"
      :total-like="totalLike"
      :is-togglable="false"
      :is-max="isMaxLike"
      :is-show-max="isFlipped"
      :is-show-total-like=isShowTotalLike
      :href="popupLikeURL"
      @like="onClickLike"
      @click-stats="onClickLikeStats"
    )

  mixin SocialMediaConnect
    SocialMediaConnect(
      :username="id"
      :platforms="platforms"
      :limit="5"
    )
      block

  div(:class="rootClass")

    svg(style="line-height:0;position:absolute;z-index:-1")
      clipPath(
        id="badge-clip"
        clipPathUnits="objectBoundingBox"
        preserveAspectRatio="xMinYMin none"
        :transform="`scale(${1/288} ${1/104})`"
      )
        path(:d="badgeClipPath")

    //- BEGIN - Version 2
    .likecoin-embed__layout
      .likecoin-embed__layout-left.likecoin-embed__cta-badge-wrapper
        Transition(
          :css="false"
          mode="out-in"
          @enter="onCtaBadgeEnter"
          @leave="onCtaBadgeLeave"
        )
          .likecoin-embed__cta-badge(
            :key="v2State"
          )
            i18n(
              :path="v2CTABadgeI18nPath"
              tag="div"
            )
              br(place="br")
              a(
                place="becomeLiker"
                @click="onClickLoginButton"
              )
                | {{ $t('EmbedV2.becomeLiker') }}
              a(
                place="becomeCivicLiker"
                @click="convertLikerToCivicLiker"
              )
                | {{ $t('EmbedV2.becomeCivicLiker') }}
              a(
                place="becomePaidCivicLiker"
                @click="convertLikerToCivicLiker"
              )
                | {{ $t('EmbedV2.becomePaidCivicLiker') }}
      .likecoin-embed__layout-right.likecoin-embed__like-button-wrapper
        +LikeButton("false")

    .likecoin-embed__layout
      .likecoin-embed__layout-left
        +SocialMediaConnect
          template(#before)
            li.likecoin-embed__avatar
              LcAvatar(
                :src="avatar"
                :halo="avatarHalo"
                :is-clickable="true"
                :is-halo-clickable="true"
                size="large"
                @click="onClickAvatar"
                @click-halo="onClickAvatarHalo"
              )
      .likecoin-embed__layout-right.likecoin-embed__like-count-wrapper
        button.likecoin-embed__like-count(
          @click="onClickLikeStats"
        )
          | {{ $tc('EmbedV2.likeCountLabel', totalLike, { n: totalLike }) }}
    //- END - Version 2

</template>

<script>
import { TimelineMax } from 'gsap/all';
import { Elastic, Power2 } from 'gsap/EasePack';

import {
  checkIsMobileClient,
  requestStorageAPIAccess,
  isAndroid,
  isFacebookBrowser,
} from '~/util/client';

import mixin from '~/mixins/embed-button';
import LikeButton from '~/components/LikeButton';
import { logTrackerEvent } from '@/util/EventLogger';

export default {
  name: 'embed-id-button',
  layout: 'embed',
  components: {
    LikeButton,
  },
  mixins: [mixin],
  data() {
    return {
      shouldShowBackside: false,
      isUserFetched: false,
    };
  },
  computed: {
    version() {
      if (!this.$exp) return 2;
      const { name, $activeVariants } = this.$exp;
      if (name === 'like-button-v3'
        && $activeVariants.find(variant => variant.name === 'v3')) return 3;
      return 2;
    },
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
        `likecoin-embed--button-v${this.version}`,
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
    v2State() {
      if (!this.isLoggedIn) {
        return 'muggle';
      }

      if (!this.isSubscribed) {
        if (this.likeCount < 1) {
          return 'liker0';
        }
        if (this.likeCount < 5) {
          return 'liker1';
        }
        return 'liker5';
      }

      if (this.isTrialSubscriber) {
        if (this.likeCount < 1) {
          return 'civicLikerTrial0';
        }
        if (this.likeCount < 5) {
          return 'civicLikerTrial1';
        }
        return 'civicLikerTrial5';
      }

      if (this.likeCount < 1) {
        return 'civicLikerPaid0';
      }
      if (this.likeCount < 5) {
        return 'civicLikerPaid1';
      }
      return 'civicLikerPaid5';
    },
    v2CTABadgeI18nPath() {
      return `EmbedV2.badge.${this.v2State}`;
    },

    badgeClipPath() {
      return 'M32.4,80c-1.8,7.8,2.9,18.2,11.6,20c1.5,0.3,1.2,2,0,2C19.4,103.1,9.9,89.1,9,80H8c-4.4,0-8-3.6-8-8V8c0-4.4,3.6-8,8-8h272c4.4,0,8,3.6,8,8v64c0,4.4-3.6,8-8,8H32.4z';
    },
  },
  methods: {
    onCtaBadgeEnter(el, onComplete) {
      const tl = new TimelineMax({ onComplete });
      if (this.version === 3) {
        tl.from(el, 1, {
          x: '10%',
          scale: 0,
          rotation: -10,
          opacity: 0,
          transformOrigin: '5% bottom',
          ease: Elastic.easeOut,
          clearProps: 'all',
        });
      } else {
        tl.from(el, 0.4, {
          scale: 0.6,
          rotationX: -90,
          opacity: 0,
          ease: Power2.easeOut,
        });
      }
    },
    onCtaBadgeLeave(el, onComplete) {
      const tl = new TimelineMax({ onComplete });
      if (this.version === 3) {
        tl.to(el, 1, {
          x: '10%',
          scale: 0,
          rotation: -10,
          opacity: 0,
          transformOrigin: '5% bottom',
          ease: Elastic.easeIn,
          clearProps: 'all',
        });
      } else {
        tl.to(el, 0.4, {
          scale: 0.6,
          rotationX: 90,
          opacity: 0,
          ease: Power2.easeIn,
        });
      }
    },
    onCheckCookieSupport(isSupport) {
      if (isSupport) {
        logTrackerEvent(this, 'LikeButton', 'isCookieSupportTrue', 'isCookieSupportTrue', 1);
      } else {
        logTrackerEvent(this, 'LikeButton', 'isCookieSupportFalse', 'isCookieSupportFalse', 1);
      }
    },
    async onClickLoginButton(e) {
      logTrackerEvent(this, 'LikeButtonFlow', 'clickLoginButton', 'clickLoginButton(embed)', 1);
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
      await this.doLogin();
    },
    async doLogin() {
      if (!this.hasCookieSupport || (isAndroid() && isFacebookBrowser())) {
        // User has not log in and 3rd party cookie is blocked
        // or: android fb iab stuck when sign in new window, use like popup
        this.popupLike();
        logTrackerEvent(this, 'LikeButtonFlow', 'popupLike', 'popupLike(embed)', 1);
        if (!(this.hasStorageAPIAccess)) {
          if (await requestStorageAPIAccess()) {
            this.hasCookieSupport = await this.getIsCookieSupport();
            await this.updateUserSignInStatus();
          }
        }
      } else {
        // User has not log in and 3rd party cookie is not blocked
        this.signIn();
        logTrackerEvent(this, 'LikeButtonFlow', 'popupSignUp', 'popupSignUp(embed)', 1);
      }
    },
    doLike() {
      if (!this.isMaxLike) {
        this.like();
        logTrackerEvent(this, 'LikeButtonFlow', 'clickLike', 'clickLike(embed)', 1);
      }

      if (this.isMaxLike) {
        this.shouldShowBackside = true;
      }
    },
    async onClickLike() {
      logTrackerEvent(this, 'LikeButtonFlow', 'clickLikeButton', 'clickLikeButton(embed)', 1);
      if (this.isLoggedIn) {
        // Case 3: User has logged in
        this.doLike();
      } else {
        await this.doLogin();
      }
    },
    onClickLikeStats() {
      this.openLikeStats();
      logTrackerEvent(this, 'LikeButtonFlow', 'clickLikeStats', 'clickLikeStats(embed)', 1);
    },
    onClickCloseButton() {
      this.shouldShowBackside = false;
    },
    onClickFrontDisplayName() {
      logTrackerEvent(
        this,
        'LikeButtonFlow',
        'clickFrontDisplayName',
        'clickFrontDisplayName(embed)',
        1,
      );
    },
    onClickBackCTAButton() {
      if (this.isSubscribed && !this.isTrialSubscriber) {
        this.superLike();
      } else {
        this.convertLikerToCivicLiker();
      }
    },
    onClickAvatar() {
      logTrackerEvent(this, 'LikeButtonFlow', 'clickAvatar', 'clickAvatar(embed)', 1);
      this.superLike();
    },
    onClickAvatarHalo() {
      logTrackerEvent(this, 'LikeButtonFlow', 'clickAvatarHalo', 'clickAvatarHalo(embed)', 1);
      this.convertLikerToCivicLiker();
    },
  },
};
</script>

<style lang="scss">
@import "~assets/css/embed";

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

.likecoin-embed--button-v2.likecoin-embed,
.likecoin-embed--button-v3.likecoin-embed {
  margin-top: normalized(30) !important;

  .likecoin-embed {
    &__layout {
      display: flex;
    }

    &__layout-left {
      width: normalized(288);
    }

    &__cta-badge {
      height: 100%;
      min-height: normalized(100);

      border-radius: normalized(8);
      background-image: linear-gradient(56deg,#d2f0f0, #f0e6b4 65%);

      font-size: normalized(22);

      > div {
        padding: normalized(16) normalized(20);
      }
    }

    &__like-button-wrapper {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    &__avatar {
      margin-top: normalized(6);
      margin-right: normalized(4);
      margin-bottom: normalized(6);

      font-size: 0;

      .lc-avatar__content {
        width: normalized(48) !important;
      }
    }

    &__like-count {
      margin-left: normalized(24);
      padding: normalized(4);

      cursor: pointer;
      transition: opacity 0.25s ease;

      background: none;

      font-family: inherit;
      font-size: normalized(14);
      font-weight: 600;

      &:hover {
        opacity: 0.75;
      }

      &:active {
        opacity: 0.5;
      }

      &-wrapper {
        font-size: 0;
      }
    }
  }

  .like-button {
    position: relative;

    margin: 0;
    margin-left: normalized(6);
  }

  .social-media-connect {
    margin-right: 0;

    > div {
      margin-left: 0;
    }

    ul {
      align-items: center;
    }
  }

  &.likecoin-embed--logged-out {
    .likecoin-embed {
      &__cta-badge {
        background: linear-gradient(70deg, #e6e6e6 60%, #d2f0f0, #f0e6b4);
      }
    }
  }
}

.likecoin-embed--button-v3.likecoin-embed {
  .likecoin-embed {
    &__cta-badge-wrapper {
      margin-bottom: normalized(-32);
    }

    &__cta-badge {
      -webkit-clip-path: url(#badge-clip);
      clip-path: url(#badge-clip);

      > div {
        padding-bottom: normalized(48);
      }
    }

    &__avatar {
      margin-right: 0;

      font-size: 0;

      .lc-avatar {
        margin-right: 0;
        margin-left: normalized(4);

        &--with-halo {
          margin-right: normalized(6);
          margin-left: normalized(8);
        }

        &__content {
          width: normalized(68) !important;
        }
      }
    }
  }

  .social-media-connect {
    > div {
      justify-content: flex-start !important;

      margin-right: normalized(-24);
      padding-left: normalized(52);

      ul {
        justify-content: flex-start !important;

        li {
          padding: 0;

          &:not(:first-child) {
            margin-left: normalized(8);

            &:nth-child(n + 6) {
              display: none;
            }
          }
        }
      }
    }

  }
}
</style>
