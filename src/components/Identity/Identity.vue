<template>
  <svg
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Avatar -->
    <Avatar
      :x="avatarX"
      :y="avatarY"
      :url="avatarURL"
      @click="onClickAvatar"
    />
    <!-- Display Name -->
    <foreignObject
      :x="displayNameX"
      :y="displayNameY"
      :width="displayNameWidth"
      :height="displayNameHeight"
    >
      <div :style="displayNameStyle">{{ displayName }}</div>
    </foreignObject>
  </svg>
</template>

<script>
import Avatar from './Identity.avatar';

export default {
  name: 'identity',
  components: {
    Avatar,
  },
  props: {
    avatarURL: {
      type: String,
      default: '',
    },
    displayName: {
      type: String,
      default: '',
    },
  },
  computed: {
    width() {
      return this.displayNameX + this.displayNameWidth;
    },
    height() {
      return 74;
    },
    avatarX() {
      return 4;
    },
    avatarY() {
      return 13;
    },
    displayNameWidth() {
      return 180;
    },
    displayNameHeight() {
      return this.height;
    },
    displayNameX() {
      return 60;
    },
    displayNameY() {
      return 0;
    },
    displayNameStyle() {
      return {
        display: 'flex',
        alignItems: 'center',
        color: '#28646E',
        fontFamily: 'Arial, serif',
        fontSize: '18px',
        fontWeight: '500',
        height: '100%',
      };
    },
  },
  methods: {
    onClickAvatar(e) {
      this.$emit('click-avatar', e);
    },
  },
};
</script>
