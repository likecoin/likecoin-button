<template>
  <like-button
    :like-count="likeCount"
    :total-like="totalLike"
    :is-super-like="isSuperLike"
    :is-toggled="isToggled"
    @like="onClickLike"
    @click-stats="onClickLikeStats"
    @toggle="onToggle"
  />
</template>

<script>
import {
  apiPostLikeButton,
  apiGetLikeButtonMyStatus,
  apiGetLikeButtonTotalCount,
} from '@/util/api/api';

import mixin from '~/components/embed/mixin';
import LikeButton from '~/components/LikeButton';

const debounce = require('lodash.debounce');

const debouncedOnClick = debounce((that) => {
  /* eslint-disable no-param-reassign */
  const count = that.likeCount - that.likeSent;
  that.likeSent += count;
  if (count > 0) apiPostLikeButton(that.id, that.referrer, count);
  that.totalLike += count;
  /* eslint-enable no-param-reassign */
}, 500);
const LIKE_STATS_WINDOW_NAME = 'LIKER_LIST_STATS';

export default {
  name: 'embed-id-mini',
  layout: 'embed',
  components: {
    LikeButton,
  },
  mixins: [mixin],
  data() {
    return {
      isLoggedIn: false,
      isToggled: false,
      likeCount: 0,
      likeSent: 0,
      totalLike: 0,
    };
  },
  computed: {
    referrer() {
      return this.$route.query.referrer || document.referrer || '';
    },
    isSuperLike() {
      return (this.likeCount >= 5);
    },
  },
  mounted() {
    this.updateUser();
  },
  beforeDestroy() {
    this.clearUntoggleTimer();
  },
  methods: {
    async updateUser() {
      try {
        const [{ data: myData }, { data: totalData }] = await Promise.all([
          apiGetLikeButtonMyStatus(this.id, this.referrer),
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
    clearUntoggleTimer() {
      if (this.untoggleTimer) {
        clearTimeout(this.untoggleTimer);
        this.untoggleTimer = null;
      }
    },
    toggleLikeButton() {
      // interactions when toggled like button or super like
      this.isToggled = true;
      this.onClickLikeStats();
      this.untoggleLikeButton();
    },
    untoggleLikeButton() {
      this.clearUntoggleTimer();
      this.untoggleTimer = setTimeout(() => {
        this.isToggled = false;
      }, 300);
    },
    onClickLike() {
      if (!this.isSuperLike) {
        this.likeCount += 1;
      } else {
        this.toggleLikeButton();
      }
      debouncedOnClick(this);
    },
    onClickLikeStats() {
      const { id } = this.$route.params;
      const { referrer } = this.$route.query;
      window.open(
        `/in/embed/${id}/list${referrer ? `?referrer=${encodeURIComponent(referrer)}` : ''}`,
        LIKE_STATS_WINDOW_NAME,
        'menubar=no,location=no,width=576,height=768',
      );
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
