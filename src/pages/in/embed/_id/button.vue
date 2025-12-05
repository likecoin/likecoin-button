<template>
  <div>
    <LikeCoinButtonWidgetV2
      :layout="widgetLayout"
      :like-button-label="likeButtonLabel"
      :hint-label="hintText"
      :sign-up-href="signUpUrl"
      :is-logged-in="isLoggedIn"
      :is-show-like-button="isShowLikeButton"
      :stat-url="statUrl"
      @click-like-button-label="onClickLikeStats"
    >
      <template #like-button>
        <a :href="popupURL" @click.prevent>
          <LikeButton
            :id="id"
            ref="likeButton"
            :count="likeCount"
            @click="onClickLike"
          />
        </a>
      </template>
      <template #identity="identityProps">
        <a :href="creatorPortfolioURL" @click.prevent>
          <Identity
            :avatarURL="avatar"
            :display-name="displayName"
            :is-avatar-button-outlined="isCreatorCivicLiker"
            v-bind="identityProps"
            @click-avatar="onClickAvatar"
            @click-display-name="onClickAvatar"
          />
        </a>
      </template>
    </LikeCoinButtonWidgetV2>
  </div>
</template>

<script>
import {
  requestStorageAPIAccess,
  isAndroid,
  isFacebookBrowser,
} from '~/util/client';

import mixin from '~/mixins/embed-button';

import Identity from '~/components/Identity/Identity';
import LikeCoinButtonWidgetV2, {
  LAYOUTS,
  LAYOUT_DEFAULT,
} from '~/components/LikeCoinButtonWidgetV2/LikeCoinButtonWidgetV2';
import LikeButton from '~/components/LikeButtonV2/LikeButtonV2';

import { logTrackerEvent } from '@/util/EventLogger';

export default {
  name: 'embed-id-button',
  components: {
    Identity,
    LikeButton,
    LikeCoinButtonWidgetV2,
  },
  mixins: [mixin],
  layout: 'embedv2',
  data() {
    return {
      isUserFetched: false,
      isShowAltMode: false,
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
  },
  beforeDestory() {
    window.removeEventListener('message', this.onReceiveMessage, false);
  },
  methods: {
    async doLogin(action) {
      if (this.isPreview) { return; }
      this.postSignInAction = action;
      if (!this.hasCookieSupport || (isAndroid() && isFacebookBrowser())) {
        // User has not log in and 3rd party cookie is blocked
        // or: android fb iab stuck when sign in new window, use like popup
        this.openPopup(action);
        const eventAction = action.replace(/^./, s => s.toUpperCase());
        logTrackerEvent(this, 'LikeButtonFlow', `popup${eventAction}`, `popup${eventAction}(embed)`, 1);
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
        await this.doLogin('like');
      }
    },
    onClickLikeStats() {
      this.openLikeStats();
      logTrackerEvent(this, 'LikeButtonFlow', 'clickLikeStats', 'clickLikeStats(embed)', 1);
    },
    onClickAvatar() {
      logTrackerEvent(this, 'LikeButtonFlow', 'clickAvatar', 'clickAvatar(embed)', 1);
      this.goToPortfolio();
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
