<template lang="pug">
  mixin LikeButton(isShowTotalLike="true")
    LikeButton(
      ref="likeButton"
      :like-count="likeCount"
      :total-like="totalLike"
      :is-togglable="false"
      :is-max="isMaxLike"
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

  mixin Avatar
    LcAvatar(
      :src="avatar"
      :halo="avatarHalo"
      :is-clickable="true"
      :is-halo-clickable="true"
      size="large"
      @click="onClickAvatar"
      @click-halo="onClickAvatarHalo"
    )&attributes(attributes)

  div(:class="rootClass" @click="onClickInteraction")
    .like-rewards-button.like-rewards-button--base(
      v-if="!isShowAltMode"
      key="base"
    )
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
              :key="state"
              :style="ctaBadgeStyle"
            )
              i18n(
                :path="ctaBadgeI18nPath"
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

      .likecoin-embed__layout.likecoin-embed__layout--bottom
        .likecoin-embed__layout-left
          +SocialMediaConnect
            template(#before)
              li.likecoin-embed__avatar
                +Avatar

        .likecoin-embed__layout-right.likecoin-embed__like-count-wrapper
          button.likecoin-embed__like-count(
            @click="onClickLikeStats"
          )
            | {{ $tc('EmbedV2.likeCountLabel', totalLike, { n: totalLike }) }}
      //- END - Version 2

    .like-rewards-button.like-rewards-button--sticky-bottom(
      v-else-if="isStickyBottomMode"
      key="sticky-bottom"
    )
      .like-rewards-button__top-border
      .like-rewards-button__content-bar
        +LikeButton("true")

        .like-rewards-button__creator-info
          span.like-rewards-button__creator-name
            | {{ displayName }}
          LcAvatar(
            :src="avatar"
            :halo="avatarHalo"
            size="normal"
            @click="onClickAvatar"
            @click-halo="onClickAvatarHalo"
          )
</template>

<script>
import { TimelineMax } from 'gsap/all';
import { Back } from 'gsap';

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
      isUserFetched: false,
      isShowAltMode: false,
      intersectionObserver: null,
    };
  },
  computed: {
    isMobile() {
      return checkIsMobileClient();
    },
    isStickyBottomMode() {
      return this.$route.query.mode === 'sticky-bottom';
    },
    hasAltMode() {
      return this.isStickyBottomMode;
    },
    rootClass() {
      return [
        'likecoin-embed',
        `likecoin-embed--logged-${this.isLoggedIn ? 'in' : 'out'}`,
        {
          'likecoin-embed--with-halo': this.avatarHalo !== 'none',
        },
        'like-rewards-button-container',
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
    state() {
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
    ctaBadgeI18nPath() {
      return `EmbedV2.badge.${this.state}`;
    },
    ctaBadgeStyle() {
      if (this.isLoggedIn) return undefined;
      return {
        backgroundImage: 'linear-gradient(70deg, #e6e6e6 60%, #d2f0f0, #f0e6b4)',
      };
    },
    badgeClipPath() {
      return 'M32.4,80c-1.8,7.8,2.9,18.2,11.6,20c1.5,0.3,1.2,2,0,2C19.4,103.1,9.9,89.1,9,80H8c-4.4,0-8-3.6-8-8V8c0-4.4,3.6-8,8-8h272c4.4,0,8,3.6,8,8v64c0,4.4-3.6,8-8,8H32.4z';
    },
    badgeAnimatedProps() {
      return {
        opacity: 0,
        scale: 0,
        x: '10%',
        rotation: -10,
        transformOrigin: '5% bottom',
      };
    },
  },
  mounted() {
    if (this.hasAltMode) {
      this.isShowAltMode = true;
      window.addEventListener('message', this.onReceiveMessage, false);
    }
    if (window.IntersectionObserver) {
      if (!this.intersectionObserver) {
        this.intersectionObserver = new IntersectionObserver(([entry]) => {
          if (entry && entry.isIntersecting) {
            this.setIsDisplayed();
          }
        });
      }
      this.intersectionObserver.observe(this.$el);
    }
  },
  beforeDestory() {
    window.removeEventListener('message', this.onReceiveMessage, false);
  },
  destroyed() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
  },
  methods: {
    onCtaBadgeEnter(el, onComplete) {
      const tl = new TimelineMax({ onComplete });
      tl.from(el, 0.5, {
        ...this.badgeAnimatedProps,
        ease: Back.easeOut,
        clearProps: 'all',
      });
    },
    onCtaBadgeLeave(el, onComplete) {
      const tl = new TimelineMax({ onComplete });
      tl.to(el, 0.25, {
        ...this.badgeAnimatedProps,
        ease: Back.easeIn,
      });
    },
    onCheckCookieSupport(isSupport) {
      if (isSupport) {
        logTrackerEvent(this, 'LikeButton', 'isCookieSupportTrue', 'isCookieSupportTrue', 1);
      } else {
        logTrackerEvent(this, 'LikeButton', 'isCookieSupportFalse', 'isCookieSupportFalse', 1);
      }
    },
    async onClickInteraction() {
      this.setIsInteracted();
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
        this.signUp();
        logTrackerEvent(this, 'LikeButtonFlow', 'popupSignUp', 'popupSignUp(embed)', 1);
      }
    },
    doLike() {
      if (!this.isMaxLike) {
        this.like();
        logTrackerEvent(this, 'LikeButtonFlow', 'clickLike', 'clickLike(embed)', 1);
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
    onClickDisplayName() {
      logTrackerEvent(this, 'LikeButtonFlow', 'clickDisplayName', 'clickDisplayName(embed)', 1);
      this.superLike();
    },
    handleMessageAction(event, action) {
      switch (action) {
        case 'showAltMode':
          this.isShowAltMode = true;
          break;
        case 'hideAltMode':
          this.isShowAltMode = false;
          break;
        default:
      }
      if (event && event.source) {
        event.source.postMessage(JSON.stringify({ ack: action }), event.origin);
      }
    },
    onReceiveMessage(event) {
      // TODO: Check event.origin

      let actions = [];
      try {
        ({ actions } = JSON.parse(event.data));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return;
      }

      if (Array.isArray(actions)) {
        actions.forEach((action) => {
          this.handleMessageAction(event, action);
        });
      } else {
        this.handleMessageAction(event, actions);
      }
    },
  },
};
</script>

<style lang="scss">
@import "~assets/css/embed";

.likecoin-embed .like-rewards-button {
  &--base {
    perspective: 800px;

    margin-top: normalized(30) !important;
  }

  .likecoin-embed__ {
    &layout {
      display: flex;

      &--bottom {
        .likecoin-embed__layout-left {
          margin-top: normalized(16);
          padding-left: normalized(52);
        }
      }
    }

    &layout-left {
      width: normalized(288);

      &--bottom {
        padding-left: normalized(52);
      }
    }

    &cta-badge-wrapper {
      margin-bottom: normalized(-32);
    }

    &cta-badge {
      height: 100%;
      min-height: normalized(100);

      border-radius: normalized(8);
      background-image: linear-gradient(56deg,#d2f0f0, #f0e6b4 65%);

      font-size: normalized(22);

      -webkit-clip-path: url(#badge-clip);
      clip-path: url(#badge-clip);

      > div {
        padding: normalized(16) normalized(20);
        padding-bottom: normalized(48);
      }
    }

    &like-button-wrapper {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    &avatar {
      margin-top: normalized(6);
      margin-right: 0;
      margin-bottom: normalized(6);

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

    &like-count {
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
    position: relative;

    margin: 0;
    margin-left: normalized(6);
  }

  .social-media-connect {
    margin-right: 0;

    transition: opacity 0.3s ease;

    > div {
      justify-content: flex-start !important;

      margin-right: normalized(-24);
      margin-left: 0;

      ul {
        align-items: center;
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

  &--sticky-bottom {
    position: fixed;
    top: 0;
    left: 0;

    width: 100vw;

    margin-top: normalized(28);

    .like-rewards-button__ {
      &top-border {
        height: normalized(3.33);

        background-image: linear-gradient(to right, #d2f0f0, #f0e6b4);
      }

      &content-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;

        padding: 0 normalized(12);

        background: white;
      }

      &creator-info {
        display: flex;
        align-items: center;

        text-align: right;

        color: $like-gray-5;

        font-size: normalized(20);
        font-weight: 600;
      }

      &creator-name {
        margin-right: normalized(14);
      }
    }

    .like-button-wrapper {
      margin-top: normalized(10);
      margin-bottom: normalized(10);
      margin-left: 0;
    }

    .lc-avatar {
      &__content {
        width: normalized(66.66) !important;
      }
    }
  }
}
</style>
