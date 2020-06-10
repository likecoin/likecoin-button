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
    <slot
      v-bind="identitySlotProps"
      name="identity"
    >
      <Identity v-bind="identitySlotProps" />
    </slot>
    <!-- Avatar Label -->
    <foreignObject
      :y="labelY"
      x="202"
      width="68"
      height="32"
    >
      <div :style="labelStyle">{{ avatarLabel }}</div>
    </foreignObject>

    <!-- Save button -->
    <slot
      v-bind="saveSlotProps"
      name="save-button"
    >
      <SaveButton v-bind="saveSlotProps" />
    </slot>
    <!-- Save Button Label -->
    <foreignObject
      :y="labelY"
      x="144"
      width="52"
      height="32"
    >
      <div :style="labelStyle">{{ saveButtonLabel }}</div>
    </foreignObject>

    <!-- Like Button -->
    <slot name="like-button">
      <LikeButton />
    </slot>
    <!-- Like Button Label -->
    <foreignObject
      :y="labelY"
      x="28"
      width="100"
      height="32"
    >
      <div :style="labelStyle">{{ likeButtonLabel }}</div>
    </foreignObject>
  </svg>
</template>

<script>
import Identity from '../Identity/Identity';
import LikeButton from '../LikeButtonV2/LikeButtonV2';
import SaveButton from '../SaveButton/SaveButton';

export default {
  name: 'likecoin-button-widget',
  components: {
    Identity,
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
    identitySlotProps() {
      return {
        x: 209,
        y: 63,
      };
    },
    saveSlotProps() {
      return {
        x: 148,
        y: 78,
      };
    },
    labelY() {
      return 140;
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
  },
};
</script>
