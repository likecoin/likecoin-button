<template>
  <like-button
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
import mixin from '~/mixins/embed';
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
  mounted() {
    this.updateUserSignInStatus();
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
      if (this.isMaxLike) {
        this.toggleLikeButton();
      } else {
        this.like();
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
