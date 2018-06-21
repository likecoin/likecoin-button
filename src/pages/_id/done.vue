<template>
  <div class="done-page lc-container">

    <like-form
      :avatar="avatar"
      :displayName="displayName"
      :likee="likee"
    >
      <template slot="header-right">
        <a
          href="https://like.co/"
          rel="noopener noreferrer"
          target="_blank"
        >
          About LikeCoin
        </a>
      </template>

      <div class="like-form__info">
        <div class="like-form__info--super-like">
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

    <div class="done-page__tips">
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
import axios from '~/plugins/axios';

import LikeForm from '@/components/LikeForm';
import { LIKECOIN_API } from '@/constant';

export default {
  name: 'id-done',
  components: {
    LikeForm,
  },
  computed: {
    likee() {
      return this.$route.params.id;
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
    return axios.get(`${LIKECOIN_API}/api/users/id/${params.id}/min`)
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
        {
          hid: 'og_image',
          property: 'og:image',
          content: 'https://like.co/images/og/tokensale.jpg',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
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
  max-width: 576px;

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

.like-form {
  &__info {
    &--super-like {
      display: flex;
      flex-direction: column;

      margin-top: 48px;

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
  &:focus:not(:active)::after {
    animation: ripple 0.5s ease-out;
  }

  &__content {
    z-index: 1;
  }
}
</style>
