<template>
  <div class="identity" @click="$emit('click', $event)">
    <Avatar
      class="identity__avatar"
      :url="avatarUrl"
      :size="avatarSize"
      :is-outlined="isAvatarOutlined"
      :is-outline-extruded="isAvatarOutlineExtruded"
      :is-disabled="isAvatarDisabled"
      @click="onClickAvatar"
    />
    <div>
      <div
        v-if="likerId"
        :class="['text-12 opacity-50 mx-8', likerIdClass]"
      >ID: {{ likerId }}</div>
      <div
        v-if="displayName"
        :class="['identity__display-name', displayNameClass]"
      >{{ displayName }}</div>
    </div>
  </div>
</template>

<script>
import Avatar from './IdentityV2.avatar';

export default {
  name: 'identity-v2',
  components: {
    Avatar,
  },
  props: {
    avatarSize: {
      type: Number,
      default: 40,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    isAvatarDisabled: {
      type: Boolean,
      default: false,
    },
    isAvatarOutlined: {
      type: Boolean,
      default: false,
    },
    isAvatarOutlineExtruded: {
      type: Boolean,
      default: true,
    },
    likerId: {
      type: String,
      default: '',
    },
    likerIdClass: {
      type: String,
      default: '',
    },
    displayName: {
      type: String,
      default: '',
    },
    displayNameClass: {
      type: String,
      default: '',
    },
  },
  methods: {
    onClickAvatar(e) {
      this.$emit('click-avatar', e);
    },
  },
};
</script>

<style lang="scss">
.identity {
  display: flex;
  align-items: center;

  &__display-name {
    margin: 0.5em;

    word-break: break-all;

    color: #28646e;

    font-family: Source Sans Pro, Arial, sans-serif;
    font-size: 1rem;
    font-weight: 500;

    overflow-wrap: anywhere;
  }
}
</style>
