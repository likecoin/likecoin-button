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
import {
  apiPostLikeButton,
  apiGetLikeButtonMyStatus,
  apiGetLikeButtonTotalCount,
} from '@/util/api/api';

import mixin from '~/components/embed/mixin';
import LikeButton from '~/components/LikeButton';

import { LIKECOIN_MISC_API_BASE } from '~/constant/index';

const debounce = require('lodash.debounce');

const debouncedOnClick = debounce((that) => {
  /* eslint-disable no-param-reassign */
  const count = that.likeCount - that.likeSent;
  that.likeSent += count;
  if (count > 0) apiPostLikeButton(that.id, that.referrer, count);
  that.totalLike += count;
  /* eslint-enable no-param-reassign */
}, 500);
const LIKE_STATS_WINDOW_NAME = 'LIKER_LIST_STATS_WINDOW';
const SUPER_LIKE_WINDOW_NAME = 'SUPER_LIKE_WINDOW';

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
      return this.urlReferrer || (process.client && document.referrer) || '';
    },
    isMaxLike() {
      return (this.likeCount >= 5);
    },
  },
  created() {
    if (process.client) {
      this.updateUser();
    }
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
        if (this.$sentry) {
          this.$sentry.configureScope((scope) => {
            scope.setUser({ id: liker });
          });
        }
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
      window.open(
        `${LIKECOIN_MISC_API_BASE}/${this.id}/${this.amount}`,
        SUPER_LIKE_WINDOW_NAME,
        'menubar=no,location=no,width=415,height=768',
      );
      this.untoggleLikeButton();
    },
    untoggleLikeButton() {
      this.clearUntoggleTimer();
      this.untoggleTimer = setTimeout(() => {
        this.isToggled = false;
      }, 300);
    },
    onClickLike() {
      if (!this.isMaxLike) {
        this.likeCount += 1;
      } else {
        this.toggleLikeButton();
      }
      debouncedOnClick(this);
    },
    onClickLikeStats() {
      const { id } = this.$route.params;
      const referrer = this.urlReferrer;
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
