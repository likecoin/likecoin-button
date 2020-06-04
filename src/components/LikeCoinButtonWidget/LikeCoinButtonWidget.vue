<template>
  <svg
    :style="{
      display: 'inline-block',
      width: '100%',
      maxWidth: '480px',
      userSelect: 'none',
    }"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 480 180"
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
        :r="avatarRadius + 3"
        :style="avatarOuterRimStyle"
      />
    </g>
    <!-- Avatar Label -->
    <foreignObject
      x="202"
      y="134"
      width="68"
      height="32"
    >
      <div :style="labelStyle">{{ avatarLabel }}</div>
    </foreignObject>
    <!-- Display Name -->
    <foreignObject
      x="270"
      y="60"
      width="180"
      height="74"
    >
      <div :style="displayNameStyle">{{ displayName }}</div>
    </foreignObject>

    <!-- Save button -->
    <foreignObject
      x="148"
      y="78"
      width="44"
      height="44"
    >
      <slot name="save-button">
        <SaveButton />
      </slot>
    </foreignObject>
    <!-- Save Button Label -->
    <foreignObject
      x="144"
      y="134"
      width="52"
      height="32"
    >
      <div :style="labelStyle">{{ saveButtonLabel }}</div>
    </foreignObject>

    <!-- Like Button -->
    <foreignObject
      width="156"
      height="156"
    >
      <div
        :style="{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }"
      >
        <slot name="like-button">
          <LikeButton />
        </slot>
      </div>
    </foreignObject>
    <!-- Like Button Label -->
    <foreignObject
      x="40"
      y="134"
      width="76"
      height="32"
    >
      <div :style="labelStyle">{{ likeButtonLabel }}</div>
    </foreignObject>
  </svg>
</template>

<script>
import LikeButton from '../LikeButtonV2/LikeButtonV2';
import SaveButton from '../SaveButton/SaveButton';

export default {
  name: 'likecoin-button-widget',
  components: {
    LikeButton,
    SaveButton,
  },
  props: {
    likeButtonLabel: {
      type: String,
      default: '',
    },
    saveButtonLabel: {
      type: String,
      default: '',
    },
    avatarLabel: {
      type: String,
      default: '',
    },
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
    avatarCenterX() {
      return 236;
    },
    avatarCenterY() {
      return 100;
    },
    avatarRadius() {
      return 19;
    },
    avatarRimStyle() {
      return {
        fill: 'none',
        strokeWidth: '1.8px',
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
    labelStyle() {
      return {
        color: '#9B9B9B',
        fontFamily: 'Arial, serif',
        fontSize: '14px',
        textAlign: 'center',
        width: '100%',
      };
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
