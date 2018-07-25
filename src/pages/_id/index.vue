<template>
  <div class="lc-container">
    <vue-recaptcha
      ref="invisibleRecaptcha"
      size="invisible"
      sitekey="6Le9w10UAAAAANsMwDA5YuiwCudW8YKu2RGI8Hcl"
      @verify="onCaptchaVerify"
      @expired="onCaptchaExpired"
      @render="onCaptchaRender"
    />

    <like-form
      :avatar="avatar"
      :displayName="displayName"
      :likee="likee"
    >
      <div class="like-form__info">
        <div
          v-if="isError && isNotFound"
          class="like-form__info--error"
        >
          {{ $t('general.error') }}
        </div>
        <div
          v-else
          class="like-form__info--pending"
        >
          <loading-indicator color="#d9b503" />
          <span>{{ $t('LikeButton.label.pending') }}</span>
        </div>
      </div>
    </like-form>

  </div>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';
import axios from '@/plugins/axios';

import { LIKECOIN_API } from '@/constant';
import { apiGetUserMinById } from '@/util/api/api';
import LikeForm from '@/components/LikeForm';
import LoadingIndicator from '@/components/LoadingIndicator';
import { logTrackerEvent } from '@/util/EventLogger';

const PENDING_LIKE_INTERVAL = 200;

export default {
  name: 'id',
  components: {
    LikeForm,
    LoadingIndicator,
    VueRecaptcha,
  },
  data() {
    return {
      reCaptchaResponse: '',
      isNeedCaptcha: false,
      isDone: false,
      isError: false,
      isNotFound: false,
      timeStarted: Date.now(),
      updateTimer: null,
    };
  },
  computed: {
    likee() {
      return this.$route.params.id;
    },
    referrer() {
      return this.$route.query.referrer || document.referrer || '';
    },
  },
  asyncData({
    route,
    params,
    query,
    redirect,
    error,
  }) {
    if (params.id !== params.id.toLowerCase()) {
      redirect({ name: route.name, params: { ...params, id: params.id.toLowerCase() }, query });
    }
    return apiGetUserMinById(params.id)
      .then((res) => {
        const { avatar, displayName } = res.data;
        return {
          avatar,
          displayName: displayName || params.id,
        };
      })
      .catch((e) => { // eslint-disable-line no-unused-vars
        error({ statusCode: 404, message: '' });
      });
  },
  head() {
    return {
      title: this.$t('LikeButton.head.title', { name: this.displayName }),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('LikeButton.head.title', { name: this.displayName }),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('LikeButton.head.description'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('LikeButton.head.description'),
        },
      ],
    };
  },
  mounted() {
    logTrackerEvent(this, 'LikeButtonFlow', 'startLIKE', 'startLIKE', 1);
    this.timeStarted = Date.now();
    if (this.updateTimer) clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(async () => {
      const timeDiff = Math.floor((Date.now() - this.timeStarted));
      logTrackerEvent(this, 'LikeButtonFlow', 'liking', 'liking', timeDiff);
    }, PENDING_LIKE_INTERVAL);
  },
  beforeDestroy() {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
      this.updateTimer = null;
    }
  },
  methods: {
    async postLike() {
      try {
        await axios.post(
          `${LIKECOIN_API}/api/like/${this.likee}`,
          { reCaptchaResponse: this.reCaptchaResponse },
          { headers: { 'Like-Referer': this.referrer } },
        );
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.isNotFound = true;
        }
        this.isError = true;
      }
      this.isDone = true;
      clearTimeout(this.updateTimer);
      const timeDiff = Math.floor((Date.now() - this.timeStarted));
      logTrackerEvent(this, 'LikeButtonFlow', 'completeLIKE', 'completeLIKE', timeDiff);
      this.$router.replace({ name: 'id-done', params: this.$route.params });
    },
    onCaptchaVerify(response) {
      this.isNeedCaptcha = false;
      this.reCaptchaResponse = response;
      if (!this.isDone) this.postLike();
    },
    onCaptchaExpired() {
      this.reCaptchaResponse = '';
    },
    onCaptchaRender() {
      this.isNeedCaptcha = true;
      this.$refs.invisibleRecaptcha.execute();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/css/mixin";

.like-form {
  :global(.like-form__header) {
    @include background-image-sliding-animation-x(
      linear-gradient(260deg, #d2f0f0, #f0e6b4)
    );
  }
  &__info {
    > * {
      display: flex;
      flex-direction: row;
      justify-content: center;

      margin-top: 72px;
      margin-bottom: 56px;

      font-size: 32px;
      font-weight: 300;
    }

    &--pending {
      color: #d9b503;

      span {
        padding-left: 16px;
      }
    }

    &--error {
      color: #fc5757;
    }
  }
}
</style>
