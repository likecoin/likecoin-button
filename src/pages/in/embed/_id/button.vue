<template lang="pug">
  div(@click="onClickInteraction")
    LikeCoinButtonWidget(
      :layout="widgetLayout"
      :like-button-label="likeButtonLabel"
      :save-button-label="saveButtonLabel"
      :avatar-label="avatarLabel"
    )
      template(#like-button)
        LikeButton(
          :count="likeCount"
          :cooldown="cooldownProgress"
          :has-super-liked="hasSuperLiked"
          :is-super-like-enabled="canSuperLike"
          @click="onClickLike"
        )

      template(#save-button="saveButtonProps")
        SaveButton(
          v-bind="saveButtonProps"
          :toggled="hasBookmarked"
          @click="onClickSaveButton"
        )

      template(#identity="identityProps")
        Identity(
          :avatarURL="avatar"
          :display-name="displayName"
          v-bind="identityProps"
          @click-avatar="onClickFollow"
        )
</template>

<script>
import {
  requestStorageAPIAccess,
  isAndroid,
  isFacebookBrowser,
} from '~/util/client';

import mixin from '~/mixins/embed-button';

import Identity from '~/components/Identity/Identity';
import LikeCoinButtonWidget, {
  LAYOUTS,
  LAYOUT_DEFAULT,
} from '~/components/LikeCoinButtonWidget/LikeCoinButtonWidget';
import LikeButton from '~/components/LikeButtonV2/LikeButtonV2';
import SaveButton from '~/components/SaveButton/SaveButton';

import { logTrackerEvent } from '@/util/EventLogger';

export default {
  name: 'embed-id-button',
  layout: 'embedv2',
  components: {
    Identity,
    LikeCoinButtonWidget,
    LikeButton,
    SaveButton,
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
    widgetLayout() {
      if (this.isShowAltMode) {
        const { mode } = this.$route.query;
        if (LAYOUTS.includes(mode)) {
          return mode;
        }
      }
      return LAYOUT_DEFAULT;
    },
    hasAltMode() {
      const { mode } = this.$route.query;
      return LAYOUTS.includes(mode) && mode !== LAYOUT_DEFAULT;
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
    async onClickInteraction() {
      this.setIsInteracted();
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
    async doLike() {
      if (!this.isMaxLike) {
        this.like();
        logTrackerEvent(this, 'LikeButtonFlow', 'clickLike', 'clickLike(embed)', 1);
      } else if (this.canSuperLike) {
        await this.newSuperLike();
        await this.updateSuperLikeStatus();
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
    onClickSaveButton() {
      logTrackerEvent(this, 'LikeButtonFlow', 'clickSaveButton', 'clickSaveButton(embed)', 1);
      this.toggleBookmark();
    },
    onClickFollow() {
      logTrackerEvent(this, 'LikeButtonFlow', 'clickFollowButton', 'clickFollowButton(embed)', 1);
      this.toggleFollow();
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
