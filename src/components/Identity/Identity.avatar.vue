<template>
  <svg
    :viewBox="`0 0 ${width} ${height}`"
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
    <g :style="buttonPressedStyle">
      <g :style="{ clipPath: 'url(#avatar-mask)' }">
        <image
          :href="url"
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
        v-if="isOutlined"
        :cx="avatarCenterX"
        :cy="avatarCenterY"
        :r="avatarRimRadius"
        :style="avatarOuterRimStyle"
      />
      <foreignObject
        :x="padding"
        :y="padding"
        :width="buttonSize"
        :height="buttonSize"
      >
        <button
          :style="buttonBaseStyle"
          :disabled="isDisabled"
          v-on="buttonListeners"
        />
      </foreignObject>
    </g>
  </svg>
</template>

<script>
import ButtonMixin from '../../mixins/button';

export default {
  name: 'identity-avatar',
  mixins: [ButtonMixin],
  props: {
    url: {
      type: String,
      default: '',
    },
    isOutlined: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    padding() {
      return 2;
    },
    width() {
      return (this.avatarRimRadius + this.padding) * 2;
    },
    height() {
      return this.width;
    },
    avatarCenterX() {
      return this.width / 2;
    },
    avatarCenterY() {
      return this.height / 2;
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
      const style = {
        ...this.avatarRimStyle,
        stroke: '#50e3c2',
        transition: 'stroke-width 0.2s ease',
      };
      if (this.isHovering) {
        style.strokeWidth = `${this.avatarRimStrokeWidth * 1.5}px`;
      }
      return style;
    },
    buttonSize() {
      return this.width - this.padding / 2;
    },
  },
};
</script>
