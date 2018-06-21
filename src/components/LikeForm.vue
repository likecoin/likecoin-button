<template>
  <div class="like-form">

    <header class="like-form__header">
      <div class="like-form__header__left">
        <slot name="header-left" />
      </div>

      <img
        class="like-form__header__icon"
        :src="LikeCoinIcon"
      />

      <div class="like-form__header__right">
        <slot name="header-right" />
      </div>
    </header>

    <div class="like-form__content">

      <div class="like-form__user">
        <div class="like-form__user__avatar">
          <a
            v-if="avatar"
            :href="`https://like.co/${likee}`"
            place="user"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img :src="avatar" />
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

      <slot />

    </div>

  </div>
</template>

<script>
import LikeCoinIcon from '../assets/logo/icon.svg';

export default {
  name: 'like-form',
  data() {
    return {
      LikeCoinIcon,
    };
  },
  props: ['avatar', 'displayName', 'likee'],
};
</script>

<style lang="scss">
$header-icon-width: 128px;
$header-icon-height: 166px;
$header-height: 48px;

.like-form {
  width: 100%;
  padding-top: ($header-icon-height - $header-height) / 2 + 16px;

  &__header {
    position: relative;

    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;

    height: $header-height;
    padding: 0 24px;

    background: linear-gradient(255deg, #d2f0f0, #f0e6b4);

    font-size: 14px;

    @media (max-width: 600px) {
      font-size: 12px;
    }

    &__icon {
      position: absolute;
      top: calc(45% - #{$header-icon-height} / 2);
      left: calc(50% - #{$header-icon-width} / 2);

      width: $header-icon-width;
      height: $header-icon-height;
    }
  }

  &__content {
    background-color: #f7f7f7;
    @media (min-width: 600px + 1px) {
      padding: 80px 48px 38px;
    }
    @media (max-width: 600px) {
      padding: 80px 16px 24px;
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

    &__avatar {
      overflow: hidden;
      flex-shrink: 0;

      width: 80px;
      height: 80px;
      margin: 10px 0;

      border-radius: 50%;
      box-shadow: 0 0 1px #9b9b9b;

      img {
        width: 100%;
        height: 100%;
      }
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
}
</style>
