<template>
  <like-button
    ref="likeButton"
    :like-count="likeCount"
    :total-like="totalLike"
    :is-max="isMaxLike"
    :is-toggled="isToggled"
    @like="onClickLike"
    @click-stats="onClickLikeStats"
    @toggle="onToggle"
  />
</template>

<script>
import mixin from '~/mixins/embed-button';
import LikeButton from '~/components/LikeButton';

export default {
  name: 'embed-id-mini',
  layout: 'embed',
  components: {
    LikeButton,
  },
  mixins: [mixin],
  data() {
    return {
      isToggled: false,
    };
  },
  beforeDestroy() {
    this.clearUntoggleTimer();
  },
  methods: {
    clearUntoggleTimer() {
      if (this.untoggleTimer) {
        clearTimeout(this.untoggleTimer);
        this.untoggleTimer = null;
      }
    },
    toggleLikeButton() {
      // interactions when toggled like button or super like
      this.isToggled = true;
      this.superLike();
      this.untoggleLikeButton();
    },
    untoggleLikeButton() {
      this.clearUntoggleTimer();
      this.untoggleTimer = setTimeout(() => {
        this.isToggled = false;
      }, 300);
    },
    onClickLike() {
      if (this.isLoggedIn) {
        // Case 3: User has logged in
        if (!this.isMaxLike) {
          this.like();
        }
        if (this.isMaxLike) {
          this.toggleLikeButton();
        }
      } else if (this.hasCookieSupport) {
        // Case 1: User has not log in and 3rd party cookie is not blocked
        this.signIn();
      } else {
        // Case 2: User has not log in and 3rd party cookie is blocked
        this.popupLike();
      }
    },
    onClickLikeStats() {
      this.openLikeStats();
    },
    onToggle(isToggled) {
      if (isToggled) {
        this.toggleLikeButton();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.like-button {
  padding: 60px 32px 32px;
}
</style>
