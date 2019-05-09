<template>
  <div class="lc-container">
    <vue-recaptcha
      v-if="!isDonePage"
      @verify="onCaptchaVerify"
      @expired="onCaptchaExpired"
      @render="onCaptchaRender"
      ref="invisibleRecaptcha"
      size="invisible"
      sitekey="6Le9w10UAAAAANsMwDA5YuiwCudW8YKu2RGI8Hcl"
    />
    <div
      v-else
      @click="$router.go(-1)"
      class="done-page__back-button"
    >
      <back-icon />
      <span>
        {{ $t('general.back') }}
      </span>
    </div>

    <like-form
      :avatar="avatar"
      :class="{ 'like-form--done': isDonePage }"
      :displayName="displayName"
      :likee="likee"
    >

      <template
        v-if="isDonePage"
        slot="header-right"
      >
        <a
          href="https://like.co/"
          rel="noopener noreferrer"
          target="_blank"
        >
          {{ $t('LikeButton.button.aboutLikeCoin') }}
        </a>
      </template>

      <div class="like-form__user">
        <div class="like-form__user__avatar">
          <a
            v-if="avatar"
            :href="`https://like.co/${likee}`"
            place="user"
            rel="noopener noreferrer"
            target="_blank"
          >
            <lc-avatar
              :src="avatar"
              :halo="avatarHalo"
              size="100"
            />
          </a>
        </div>
        <div class="like-form__user__detail">
          <h2>{{ $t('LikeButton.label.thanksAppreciation') }}</h2>
          <i18n
            path="LikeButton.label.distributeLikeFromEcosystem"
            tag="p"
          >
            <a
              :href="`https://like.co/${likee}`"
              place="user"
              rel="noopener noreferrer"
              target="_blank"
            >{{ displayName }}</a>
          </i18n>
        </div>
      </div>

      <div
        v-if="!isDonePage"
        class="like-form__info"
      >
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
      <div
        v-else
        class="like-form__info"
      >
        <div class="like-form__info--max-like">
          <i18n
            path="LikeButton.label.considerSuperLike"
            tag="span"
          >
            <a
              :href="`https://like.co/${likee}`"
              place="likee"
              rel="noopener noreferrer"
              target="_blank"
            >{{ displayName }}</a>
          </i18n>
          <a
            :href="`https://like.co/${likee}/8`"
            class="super-like-button"
          >
            <div class="super-like-button__content">Super Like</div>
          </a>
        </div>
      </div>
    </like-form>

    <div
      v-if="isDonePage"
      class="done-page__tips"
    >
      {{ $t('LikeButton.label.doYouKnow.title') }}
      <i18n
        path="LikeButton.label.doYouKnow.login"
        tag="span"
      >
        <a
          href="https://like.co/in"
          place="loginPage"
          rel="noopener noreferrer"
          target="_blank"
        >
          {{ $t('LikeButton.label.doYouKnow.likecoinId') }}
        </a>
      </i18n>
    </div>

  </div>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';

import {
  apiGetUserMinById,
  apiPostLikeLink,
} from '@/util/api/api';
import LikeForm from '@/components/LikeForm';
import LoadingIndicator from '@/components/LoadingIndicator';
import { logTrackerEvent } from '@/util/EventLogger';
import { getAvatarHaloTypeFromUser } from '@/util/user';
import { handleQueryStringInUrl } from '@/util/url';

import BackIcon from '@/assets/icons/arrow.svg';

const PENDING_LIKE_INTERVAL = 200;

export default {
  name: 'id',
  components: {
    BackIcon,
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
    documentReferrer() {
      if (!process.client) return '';
      let windowReferrer = '';
      try {
        if (window.opener) {
          windowReferrer = (window.opener.document || {}).referrer;
        }
      } catch (err) {
        // no op
      }
      return windowReferrer || document.referrer || '';
    },
    urlReferrer() {
      const { query } = this.$route;
      let { referrer = '' } = query;
      if (referrer) {
        referrer = handleQueryStringInUrl(referrer);
      }
      return referrer;
    },
    referrer() {
      return this.urlReferrer || this.documentReferrer || '';
    },
    isDonePage() {
      return this.$route.name === 'id-done';
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
        const {
          avatar,
          displayName,
        } = res.data;
        return {
          avatar,
          avatarHalo: getAvatarHaloTypeFromUser(res.data),
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
      script: [
        { src: 'https://www.recaptcha.net/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit', async: true, defer: true },
      ],
    };
  },
  mounted() {
    if (!this.isDonePage) {
      logTrackerEvent(this, 'LikeButtonFlow', 'startLIKE', 'startLIKE', 1);
      this.timeStarted = Date.now();
      if (this.updateTimer) clearTimeout(this.updateTimer);
      this.updateTimer = setTimeout(async () => {
        const timeDiff = Math.floor((Date.now() - this.timeStarted));
        logTrackerEvent(this, 'LikeButtonFlow', 'liking', 'liking', timeDiff);
      }, PENDING_LIKE_INTERVAL);
    }
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
        await apiPostLikeLink(
          this.likee,
          this.referrer,
          { reCaptchaResponse: this.reCaptchaResponse },
          this.documentReferrer,
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
  /deep/ .like-form__header {
    @include background-image-sliding-animation-x(
      linear-gradient(260deg, #d2f0f0, #f0e6b4)
    );
  }

  &.like-form--done {
    /deep/ .like-form__header {
      animation: none;

      background-size: auto;
    }
  }

  &__user {
    display: flex;
    align-items: center;
    flex-direction: row;

    @media (max-width: 576px) {
      flex-direction: column;

      text-align: center;
    }

    &__detail {
      margin-left: 20px;

      color: #462405;

      h2, p {
        line-height: 27px;

        -webkit-margin-before: 0;
        -webkit-margin-after: 0;
      }

      h2 {
        font-size: 22px;
        font-weight: 300;
      }

      p {
        margin-top: 4px;

        font-size: 16px;
        font-weight: 600;

        a {
          text-decoration: none;
        }
      }
    }
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
      align-items: center;

      color: #d9b503;

      .lc-loading-indicator {
        width: auto;

        color: currentColor;
      }

      span {
        padding-left: 16px;
      }
    }

    &--error {
      color: #fc5757;
    }

    &--max-like {
      display: flex;
      flex-direction: column;

      margin: 48px 0 0;

      animation: slide-down 0.5s cubic-bezier(0.2, 0.2, 0, 1);
      text-align: center;
      letter-spacing: -0.1px;

      color: #737373;

      font-size: 16px;
      line-height: 1.6;

      > span {
        a {
          text-decoration: none;

          color: inherit;

          font-weight: 600;

          &:hover {
            color: darken(#737373, 10%);
          }
        }
      }
    }
  }
}


@keyframes ripple {
  0% {
    transform: scale(0);

    opacity: 1;
  }
  20% {
    transform: scale(20);

    opacity: 1;
  }
  100% {
    transform: scale(100);

    opacity: 0;
  }
}

@keyframes shadow {
  0% {
    box-shadow: 0 0 0px rgba(40, 100, 110, 0.5);
  }
  100% {
    box-shadow: 0 0 32px rgba(40, 100, 110, 0);
  }
}

@keyframes slide-down {
  0% {
    transform: translateY(-10px);

    opacity: 0;
  }
  100% {
    transform: translateY(0px);

    opacity: 1;
  }
}

.done-page {
  &__back-button {
    position: absolute;

    display: flex;
    align-items: center;

    padding-left: 12px;

    cursor: pointer;
    transition: transform .3s ease-in-out;
    animation: slide-down 0.5s cubic-bezier(0.2, 0.2, 0, 1);

    color: #28646e;

    &:hover {
      transform: translateY(-2px);
    }

    span {
      margin-left: 16px;

      font-size: 18px;
    }
  }

  &__tips {
    padding: 16px 32px;

    animation: slide-down 0.5s cubic-bezier(0.2, 0.2, 0, 1);

    color: #737373;

    font-size: 14px;
    line-height: 22px;

    a {
      text-decoration: none;
    }
  }
}

.super-like-button {
  position: relative;

  display: flex;
  overflow: hidden;
  align-items: center;
  align-self: center;
  justify-content: center;

  width: 256px;
  min-height: 40px;
  margin-top: 24px;
  padding: 4px;

  animation: shadow 3s infinite;
  text-decoration: none;

  color: #fff;
  border-radius: 20px;
  background-image: linear-gradient(260deg, #d2f0f0, #f0e6b4);

  font-family: 'Open Sans', Arial, sans-serif !important;
  font-size: 24px;
  line-height: 40px;

  &:before {
    position: absolute;
    z-index: 1;
    top: 4px;
    right: 4px;
    bottom: 4px;
    left: 4px;

    content: "";
    transition: background-color 0.2s ease-in-out;

    border-radius: 20px;
    background-color: #28646e;

    &:hover {
      background-color: lighten(#28646e, 5);
    }
  }
  &:hover:before {
    background-color: lighten(#28646e, 5);
  }

  &:after {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;

    width: 3px;
    height: 3px;

    content: "";

    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
  }
  &:not(:active)::after {
    animation: ripple 0.5s ease-out;
  }

  &__content {
    z-index: 1;
  }
}
</style>
