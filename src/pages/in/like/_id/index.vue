<template>
  <div class="lc-page-wrapper">

    <header class="lc-page-header">
      <div class="lc-page-header__left-section">
        <a @click="onClickBackButton">{{ $t('general.back') }}</a>
      </div>
    </header>

    <div class="lc-page-content">
      <div class="like-single-page">

        <h1 class="referrer-title">
          {{ referrerTitle }}
        </h1>

        <div class="like-panel">
          <div class="like-panel__badge">

            <embed-user-info
              v-if="isLoggedIn"
              :avatar="avatar"
              :avatar-halo="avatarHalo"
            />

            <div
              :style="contentStyle"
              class="text-content-wrapper"
            >
              <transition
                name="text-content-"
                @enter="setContentHeight"
              >
                <!-- Loading -->
                <div
                  v-if="contentKey === 'loading'"
                  v-bind="textContentProps"
                >
                  <no-ssr>
                    <lc-loading-indicator />
                  </no-ssr>
                </div>

                <!-- Logged In -->
                <div
                  v-else-if="contentKey === 'loggedIn'"
                  v-bind="textContentProps"
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
                    >{{ displayName }}</a>
                  </i18n>
                </div>

                <!-- Max Liked -->
                <div
                  v-else-if="contentKey === 'cta'"
                  v-bind="textContentProps"
                >
                  <div
                    v-if="ctaSubtitle"
                    class="text-content__subtitle"
                  >
                    {{ ctaSubtitle }}
                  </div>
                  <div class="text-content__title text-content__title--civic-liker">
                    {{ ctaTitle }}
                  </div>

                  <a
                    id="embed-cta-button"
                    @click="onClickCTAButton"
                  >
                    <div class="button-content-wrapper">
                      <div class="button-content">
                        {{ ctaButtonTitle }}
                      </div>
                    </div>
                  </a>
                </div>

              </transition>
            </div>
          </div>

          <like-button
            v-if="isLoggedIn"
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
  apiGetLikeButtonMyStatus,
  apiGetLikeButtonTotalCount,
  apiGetPageTitle,
} from '@/util/api/api';

import { checkValidDomainNotIP, handleQueryStringInUrl } from '@/util/url';

import EmbedUserInfo from '~/components/embed/EmbedUserInfo';

import mixin from '~/components/embed/mixin';
import LikeButton from '~/components/LikeButton';
import { logTrackerEvent } from '@/util/EventLogger';

export default {
  components: {
    LikeButton,
    EmbedUserInfo,
  },
  mixins: [mixin],
  data() {
    return {
      isLoggedIn: false,
      isSubscribed: false,
      isTrialSubscriber: false,
      referrerTitle: '',

      contentKey: 'loading',
      contentStyle: {
        height: 0,
      },
    };
  },
  asyncData(ctx) {
    return Promise.all([
      mixin.asyncData(ctx),
      () => {
        const { query } = ctx;
        let { referrer = '' } = query;
        referrer = handleQueryStringInUrl(referrer);
        const url = encodeURI(referrer);
        if (checkValidDomainNotIP(url)) {
          return apiGetPageTitle(referrer)
            .then(referrerTitle => ({ referrerTitle }));
        }
        return { referrerTitle: '' };
      },
    ]).then(res => ({ ...res[0], ...res[1] }));
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
      return this.urlReferrer || (process.client && document.referrer) || '';
    },
    textContentProps() {
      return {
        key: this.contentKey,
        ref: this.contentKey,
        class: 'text-content',
      };
    },
    ctaTitle() {
      if (this.isTrialSubscriber) {
        return this.$t('Embed.back.civicLiker.trial.title');
      }
      if (this.isSubscribed) {
        return this.$t('Embed.back.civicLiker.paid.title');
      }
      return this.$t('Embed.back.civicLiker.title');
    },
    ctaSubtitle() {
      if (this.isSubscribed && !this.isTrialSubscriber) {
        return '';
      }
      return this.$t('Embed.back.civicLiker.subtitle');
    },
    ctaButtonTitle() {
      if (this.isTrialSubscriber) {
        return this.$t('Embed.back.civicLiker.trial.button');
      }
      if (this.isSubscribed) {
        return this.$t('Embed.back.civicLiker.paid.button');
      }
      return this.$t('Embed.back.civicLiker.button');
    },
  },
  created() {
    if (process.client) {
      this.updateUser();
    }
  },
  mounted() {
    // Initialize content height
    this.setContentHeight();
    this.resizeListener = window.addEventListener('resize', this.setContentHeight);
  },
  beforeDestroy() {
    if (this.resizeListener) {
      window.removeEventListener('resize', this.setContentHeight);
    }
  },
  methods: {
    async updateUser() {
      try {
        const [{ data: myData }, { data: totalData }] = await Promise.all([
          apiGetLikeButtonMyStatus(this.id, this.referrer),
          apiGetLikeButtonTotalCount(this.id, this.referrer),
        ]);
        const {
          liker,
          count,
          isSubscribed,
          isTrialSubscriber,
        } = myData;
        this.isLoggedIn = !!liker;
        this.isSubscribed = isSubscribed;
        this.isTrialSubscriber = isTrialSubscriber;
        if (this.isLoggedIn) {
          this.contentKey = 'loggedIn';
        } else {
          window.location = `https://${LIKE_CO_HOSTNAME}/in/register?redirect=${encodeURIComponent(window.location.href)}&referrer=${encodeURIComponent(this.referrer)}&from=${encodeURIComponent(this.$route.params.id)}`;
          return;
        }

        const { total } = totalData;
        this.totalLike = total;
        this.likeCount = count;
        this.likeSent = count;
        if (this.$sentry) {
          this.$sentry.configureScope((scope) => {
            scope.setUser({ id: liker });
          });
        }
        this.$nextTick(() => {
          this.setContentHeight();

          if (this.likeCount <= 0 && this.$refs.likeButton) {
            this.$refs.likeButton.onPressedKnob();
          }
        });
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
      }
    },
    setContentHeight() {
      const elem = this.$refs[this.contentKey];
      if (elem) {
        this.contentStyle = {
          height: `${elem.offsetHeight}px`,
        };
      }
    },
    onClickBackButton() {
      window.close();
    },
    onClickLike() {
      if (!this.isMaxLike) {
        this.like();
      }

      if (this.isMaxLike) {
        this.contentKey = 'cta';
      }
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
    onClickCTAButton() {
      const { id } = this.$route.params;
      if (this.isSubscribed && !this.isTrialSubscriber) {
        window.open(`https://${LIKE_CO_HOSTNAME}/${id}`, '_blank');
        return;
      }
      window.open(
        `https://${LIKE_CO_HOSTNAME}/in/civic?referrer=${encodeURIComponent(this.referrer)}&from=${encodeURIComponent(id)}`,
        '_blank',
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/css/variables";

$badge-width: 485px;

.lc-page-header {
  position: relative;

  height: 52px;

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
  padding: 0 12px;

  &__badge {
    display: flex;
    align-items: center;
    flex-direction: column;

    max-width: 270px;
    margin: 0 auto;
    margin-top: 104px;

    text-align: center;

    border-radius: 8px;
    background-image: linear-gradient(78deg, #d2f0f0, #f0e6b4);
  }
}

.embed-user-info {
  margin-top: -80px;
  margin-bottom: 0;
}

.lc-loading-indicator {
  margin: 0 auto;

  color: $like-green;

  font-size: 14px;
}

.text-content {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 100%;
  padding: 16px;

  &-wrapper {
    position: relative;

    overflow: hidden;

    width: 100%;

    transition: height 1s ease;
  }

  &-- {
    &enter-active,
    &leave-active {
      transition-duration: 1s;
      transition-property: opacity, transform;
    }

    &enter,
    &leave-to {
      transform: scale(0.7);

      opacity: 0;
    }
  }

  &__subtitle {
    font-size: 16px;
    line-height: 1.2;
  }

  &__title {
    font-size: 24px;
    line-height: 1.2;
  }
}

#embed-cta-button {
  margin-top: 8px;
}

.like-button {
  position: absolute;
  left: 50%;

  margin-top: -18px;

  transform: translate(-50%);

  :global(.like-button-knob) {
    outline-style: none;
  }
}
</style>
