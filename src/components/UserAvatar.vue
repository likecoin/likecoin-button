<template>
  <div class="user-avatar">
    <transition
      name="lc-transition-default"
      mode="out-in"
    >
      <lc-avatar
        v-if="user.avatar"
        :src="user.avatar"
        :halo="avatarHalo"
      />
      <div
        v-else
        class="user-avatar__placeholder--image"
      />
    </transition>

    <transition
      name="lc-transition-default"
      mode="out-in"
    >
      <a
        v-if="user.displayName"
        :href="`${LIKER_LAND_URL_BASE}/${user.id}?utm_source=button`"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span>{{ user.displayName }}</span>
      </a>
      <div
        v-else
        :style="style.displayNamePlaceholder"
        class="user-avatar__placeholder--name"
      />
    </transition>
  </div>
</template>

<script>
import { LIKER_LAND_URL_BASE } from '@/constant';

import { getAvatarHaloTypeFromUser } from '~/util/user';

export default {
  name: 'user-avatar',
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      LIKER_LAND_URL_BASE,
      style: {
        displayNamePlaceholder: {
          width: `${50 + Math.floor(Math.random() * 35)}%`,
        },
      },
    };
  },
  computed: {
    avatarHalo() {
      return getAvatarHaloTypeFromUser(this.user);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/css/variables";
@import "~assets/css/mixin";

$user-avatar-image-size: 48px;
$placeholder-gradient: linear-gradient(to right, #eee 8%, #ddd 24%, #eee 32%);

.user-avatar {
  display: flex;
  align-items: center;
  flex-direction: row;

  &__placeholder--image {
    width: $user-avatar-image-size;
    height: $user-avatar-image-size;

    border-radius: 50%;
  }

  &__placeholder {
    &--image,
    &--name {
      @include background-image-sliding-animation-x($placeholder-gradient);
    }

    &--name {
      height: 24px;
      margin-left: 12px;
    }
  }

  a {
    display: block;

    max-width: calc(100% - #{$user-avatar-image-size});
    margin-left: 12px;

    word-wrap: break-word;

    color: $like-green;

    font-size: 18px;
    font-weight: 600;

    &:not(:hover) {
      text-decoration: none;
    }
  }
}
</style>
