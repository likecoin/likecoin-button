<template>
  <svg
    :viewBox="`0 0 ${width} ${displayNameHeight}`"
    :width="width"
    :height="height"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <clipPath id="avatar-mask">
        <circle
          :cx="avatarCenterX"
          :cy="avatarCenterY"
          :r="avatarRadius"
        />
      </clipPath>
    </defs>
    <!-- Avatar -->
    <g>
      <g :style="{ clipPath: 'url(#avatar-mask)' }">
        <image
          :href="avatarURL"
          :x="avatarCenterX - avatarRadius"
          :y="avatarCenterY - avatarRadius"
          :width="avatarRadius * 2"
          :height="avatarRadius * 2"
        />
      </g>
      <circle
        :cx="avatarCenterX"
        :cy="avatarCenterY"
        :r="avatarRadius"
        :style="avatarInnerRimStyle"
      />
      <circle
        :cx="avatarCenterX"
        :cy="avatarCenterY"
        :r="avatarRimRadius"
        :style="avatarOuterRimStyle"
      />
    </g>
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
export default {
  name: 'identity',
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
    avatarCenterX() {
      return this.avatarRadius + 8;
    },
    avatarCenterY() {
      return this.displayNameHeight / 2;
    },
    avatarRadius() {
      return 19;
    },
    avatarRimStrokeWidth() {
      return 1.8;
    },
    avatarRimRadius() {
      return this.avatarRadius + 3;
    },
    avatarRimStyle() {
      return {
        fill: 'none',
        strokeWidth: `${this.avatarRimStrokeWidth}px`,
      };
    },
    avatarInnerRimStyle() {
      return {
        ...this.avatarRimStyle,
        stroke: '#e6e6e6',
      };
    },
    avatarOuterRimStyle() {
      return {
        ...this.avatarRimStyle,
        stroke: '#50e3c2',
      };
    },
    displayNameWidth() {
      return 180;
    },
    displayNameHeight() {
      return this.height;
    },
    displayNameX() {
      return this.avatarCenterX + this.avatarRadius + 12;
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
};
</script>
