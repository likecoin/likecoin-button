<template>
  <div class="lc-page-wrapper">

    <header class="lc-page-header">
      <div class="lc-page-header__left-section">
        <a @click="onClickBackButton">{{ $t('general.back') }}</a>
      </div>
    </header>

    <div class="lc-page-content">
      <div
        v-if="isLoggedIn"
        class="like-single-page"
      >

        <h1 class="referrer-title">
          {{ referrerTitle }}
        </h1>

        <div class="like-panel">
          <div class="like-panel__badge">
            <embed-user-info
              :avatar="avatar"
              :avatar-halo="avatarHalo"
            />

            <div class="text-content">
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
                >{{ displayName }}</a>
              </i18n>
            </div>
          </div>

          <like-button
            ref="likeButton"
            :like-count="likeCount"
            :total-like="totalLike"
            :is-togglable="false"
            :is-max="isMaxLike"
            @like="onClickLike"
            @click-stats="onClickLikeStats"
          />
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { LIKE_CO_HOSTNAME } from '@/constant';

import {
  apiPostLikeButton,
  apiGetLikeButtonMyStatus,
  apiGetLikeButtonTotalCount,
  apiGetPageTitle,
} from '@/util/api/api';

import { checkValidDomainNotIP } from '@/util/url';

import EmbedUserInfo from '~/components/embed/EmbedUserInfo';

import mixin from '~/components/embed/mixin';
import LikeButton from '~/components/LikeButton';
import { logTrackerEvent } from '@/util/EventLogger';

const debounce = require('lodash.debounce');

const debouncedOnClick = debounce((that) => {
  /* eslint-disable no-param-reassign */
  const count = that.likeCount - that.likeSent;
  that.likeSent += count;
  const isCookieSupport = false; // Assume this page is loaded in a pop-up, set to false
  if (count > 0) apiPostLikeButton(that.id, that.referrer, count, isCookieSupport);
  that.totalLike += count;
  /* eslint-enable no-param-reassign */
}, 500);

export default {
  components: {
    LikeButton,
    EmbedUserInfo,
  },
  mixins: [mixin],
  data() {
    return {
      isLoggedIn: false,
      likeCount: 0,
      likeSent: 0,
      totalLike: 0,
      referrerTitle: '',
    };
  },
  async asyncData({ query }) {
    const { referrer = '' } = query;
    const url = encodeURI(query.referrer);
    if (checkValidDomainNotIP(url)) {
      const referrerTitle = await apiGetPageTitle(referrer);
      return { referrerTitle };
    }
    return { referrerTitle: '' };
  },
  head() {
    return {
      htmlAttrs: {
        style: 'font-size: 410px',
      },
    };
  },
  computed: {
    referrer() {
      return this.$route.query.referrer || document.referrer || '';
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
  methods: {
    async updateUser() {
      try {
        const [{ data: myData }, { data: totalData }] = await Promise.all([
          apiGetLikeButtonMyStatus(this.id, this.referrer),
          apiGetLikeButtonTotalCount(this.id, this.referrer),
        ]);
        const { liker, count } = myData;
        this.isLoggedIn = !!liker;
        if (!this.isLoggedIn) {
          window.location = `https://${LIKE_CO_HOSTNAME}/in/register?redirect=${encodeURIComponent(window.location.href)}&referrer=${encodeURIComponent(this.referrer)}&from=${encodeURIComponent(this.$route.params.id)}`;
          return;
        }

        const { total } = totalData;
        this.totalLike = total;
        this.likeCount = count;
        this.likeSent = count;

        this.$nextTick(() => {
          if (this.likeCount <= 0 && this.$refs.likeButton) {
            this.$refs.likeButton.onPressedKnob();
          }
        });
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
    },
    onClickBackButton() {
      window.close();
    },
    onClickLike() {
      if (this.isMaxLike) {
        this.shouldShowBackside = true;
      } else {
        this.likeCount += 1;
      }
      debouncedOnClick(this);
      logTrackerEvent(this, 'LikeButtonFlow', 'clickLike', 'clickLike', 1);
    },
    onClickLikeStats() {
      const { id } = this.$route.params;
      const { referrer } = this.$route.query;
      this.$router.push({
        name: 'in-embed-id-list',
        params: { id },
        query: {
          referrer,
          show_back: '1',
        },
      });
      logTrackerEvent(this, 'LikeButtonFlow', 'clickLikeStats', 'clickLikeStats', 1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/css/variables";

$badge-width: 485px;

.lc-page-header {
  position: relative;

  height: 64px;

  background-image: linear-gradient(251deg, #d2f0f0, #f0e6b4);

  &__left-section {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;

    display: flex;
    align-items: center;

    padding-left: 16px;

    a {
      font-size: 16px;
    }
  }
}

.referrer-title {
  margin-top: 40px;
  padding: 0 16px;

  text-align: center;

  color: $like-dark-brown-2;

  font-size: 24px;
  font-weight: 300;
  line-height: 28px;
}

.like-panel {
  max-width: $badge-width;
  margin: 0 auto;

  &__badge {
    display: flex;

    margin-top: 24px;

    background-image: linear-gradient(78deg, #d2f0f0, #f0e6b4);

    @media (min-width: $badge-width + 1px) {
      border-radius: 8px;
    }

    @media (max-width: $badge-width) {
      align-items: center;
      flex-direction: column;

      text-align: center;
    }
  }
}

.text-content {
  display: flex;
  flex-direction: column;
  justify-content: center;

  margin-top: 8px;
  padding: 16px;

  &__subtitle {
    font-size: 16px;
    line-height: 1.2;
  }

  &__title {
    font-size: 24px;
    line-height: 1.2;
  }
}

.like-button {
  position: absolute;

  margin-top: -18px;

  @media (min-width: $badge-width + 1px) {
    margin-left: 44px;
  }

  @media (max-width: $badge-width) {
    left: 50%;

    transform: translate(-50%);
  }

  :global(.like-button-knob) {
    outline-style: none;
  }
}
</style>
