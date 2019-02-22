<template>
  <div
    :class="rootClass"
    v-bind="$attrs"
  >
    <div class="embed-user-info__avatar">
      <lc-avatar
        :src="avatar"
        :halo="avatarHalo"
        :is-clickable="isAvatarClickable"
        :is-halo-clickable="isAvatarHaloClickable"
        size="large"
        is-full-width
        @click="onClickAvatar"
        @click-halo="onClickAvatarHalo"
      />
    </div>

    <div
      v-if="displayName"
      class="embed-user-info__display-name"
    >
      <div>
        <nuxt-link
          :to="link"
          target="_blank"
        >
          {{ displayName }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'embed-user-info',
  props: {
    avatar: {
      type: String,
      default: null,
    },
    avatarHalo: {
      type: String,
      default: 'none',
    },
    displayName: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: null,
    },
  },
  computed: {
    rootClass() {
      return [
        'embed-user-info',
        {
          'embed-user-info--with-halo': this.avatarHalo !== 'none',
        },
      ];
    },
    isAvatarClickable() {
      return !!this.$listeners['click-avatar'];
    },
    isAvatarHaloClickable() {
      return !!this.$listeners['click-avatar-halo'];
    },
  },
  methods: {
    onClickAvatar() {
      this.$emit('click-avatar');
    },
    onClickAvatarHalo() {
      this.$emit('click-avatar-halo');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/css/embed";

$normal-x-margin: 8;

.embed-user-info {
  position: relative;

  flex-shrink: 0;

  width: #{$avatar-size}em;
  height: #{$avatar-size}em;
  margin: #{-$avatar-vertical-offset}em #{$normal-x-margin}em;

  font-size: normalized(1);

  &--with-halo {
    margin-right: #{$normal-x-margin + 10}em;
    margin-left: #{$normal-x-margin + 6}em;
  }

  &__avatar {
    position: relative;

    width: #{$avatar-size}em;
    height: #{$avatar-size}em;

    :global(.lc-avatar__content__halo) {
      position: absolute;

      font-size: 0;
    }
  }

  &__display-name {
    position: absolute;
    top: 100%;

    display: flex;
    justify-content: center;

    min-width: 100%;
    margin-top: #{(4 / 18)}em;

    letter-spacing: 0;

    font-size: 18em;
    font-weight: 600;
    line-height: #{(18.5 / 18)}em;

    .embed-user-info--with-halo & {
      margin-top: #{(12 / 18)}em;
    }

    a {
      display: inline-block;

      white-space: nowrap;

      color: $like-green;

      font-size: inherit;
      font-weight: inherit;
      line-height: inherit;
    }
  }
}
</style>
