<template>
  <div :style="rootStyle">
    <hr
      v-if="isStickyBottomLayout"
      :style="hrStyle"
    >
    <svg
      :style="svgStyle"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 480 180"
    >
      <slot
        v-bind="identitySlotProps"
        name="identity"
      >
        <Identity v-bind="identitySlotProps" />
      </slot>

      <!-- Like Button -->
      <slot
        v-if="isShowLikeButton"
        name="like-button"
      >
        <LikeButton />
      </slot>

      <!-- Like Button Label -->
      <foreignObject
        v-if="isShowLikeButton"
        :y="labelY"
        x="28"
        width="100"
        height="36"
      >
        <div :style="labelStyle">
          <button
            :style="labelButtonStyle"
            @click="$emit('click-like-button-label')"
            class="likecoin-button-widget__label-button"
          >{{ likeButtonLabel }}</button>
        </div>
      </foreignObject>

      <foreignObject
        v-if="isShowHintLabel"
        :x="saveSlotProps.x"
        y="0"
        width="300"
        height="60"
      >
        <div :style="hintLabelStyle">{{ hintLabel }}</div>
      </foreignObject>

      <!-- CTA -->
      <foreignObject
        v-if="shouldShowCta"
        :x="saveSlotProps.x"
        :y="saveSlotProps.y + 58"
        width="300"
        height="36"
      >
        <a
          :class="ctaButtonClass"
          @click="$emit('click-cta-button')"
          :href="ctaHref"
          target="_blank"
          rel="noreferrer noopener"
        >{{ ctaButtonLabel }}</a>
      </foreignObject>
    </svg>
  </div>
</template>

<script>
import Identity from '../Identity/Identity';
import LikeButton from '../LikeButtonV2/LikeButtonV2';

import { CLW3_NOTICE_URL } from '../../constant';

export const LAYOUT_DEFAULT = 'default';
export const LAYOUT_STICKY_BOTTOM = 'sticky-bottom';
export const LAYOUTS = [LAYOUT_DEFAULT, LAYOUT_STICKY_BOTTOM];

export default {
  name: 'likecoin-button-widget',
  components: {
    Identity,
    LikeButton,
  },
  props: {
    layout: {
      type: String,
      validator: value => LAYOUTS.includes(value),
      default: LAYOUT_DEFAULT,
    },
    likeButtonLabel: {
      type: String,
      default: '',
    },
    ctaButtonLabel: {
      type: String,
      default: '',
    },
    ctaButtonPreset: {
      type: String,
      default: 'default',
    },
    avatarURL: {
      type: String,
      default: '',
    },
    displayName: {
      type: String,
      default: '',
    },
    hintLabel: {
      type: String,
      default: undefined,
    },
    isShowLikeButton: {
      type: Boolean,
      default: true,
    },
    shouldShowCta: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isStickyBottomLayout() {
      return this.layout === LAYOUT_STICKY_BOTTOM;
    },
    isShowHintLabel() {
      return this.hintLabel !== undefined;
    },
    rootStyle() {
      const style = {};
      if (this.isStickyBottomLayout) {
        style.background = '#fff';
        style.marginTop = '28px';
        style.height = '100px';
      }
      return style;
    },
    hrStyle() {
      return {
        border: 'none',
        height: '3px',
        margin: 0,
        padding: 0,
        backgroundImage: 'linear-gradient(90deg,#d2f0f0,#f0e6b4)',
      };
    },
    svgStyle() {
      const style = {
        display: 'inline-block',
        width: '100%',
        userSelect: 'none',
      };
      if (this.isStickyBottomLayout) {
        style.marginTop = '-52px';
        style.marginLeft = '-10px';
        style.maxWidth = '400px';
      } else {
        style.maxWidth = '480px';
      }
      return style;
    },
    identitySlotProps() {
      return {
        x: 140,
        y: 57,
      };
    },
    saveSlotProps() {
      return {
        x: 148,
        y: 72,
      };
    },
    labelY() {
      return 140;
    },
    textStyle() {
      return {
        color: '#9B9B9B',
        fontFamily: 'Source Sans Pro, Arial, sans-serif',
        fontSize: '14px',
      };
    },
    labelStyle() {
      return {
        ...this.textStyle,
        textAlign: 'center',
        width: '100%',
      };
    },
    labelButtonStyle() {
      return {
        padding: '0 2px',
        border: 'none',
        borderRadius: '4px',
        outline: 'none',
        color: 'inherit',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        transition: 'background-color 0.2s ease',
      };
    },
    hintLabelStyle() {
      return {
        ...this.textStyle,
        width: '100%',
        height: '100%',
        display: 'flex',
        textAlign: 'left',
        alignItems: 'flex-end',
      };
    },
    ctaButtonClass() {
      return [
        'likecoin-button-widget__cta-button',
        `likecoin-button-widget__cta-button--${this.ctaButtonPreset}`,
      ];
    },
    ctaHref() {
      return CLW3_NOTICE_URL;
    },
  },
};
</script>

<style lang="css">
.likecoin-button-widget__label-button {
  background-color: transparent;
}
.likecoin-button-widget__label-button:not([disabled]):hover {
  background-color: #f4f4f4;
}
.likecoin-button-widget__label-button:not([disabled]):active {
  background-color: #e6e6e6;
}

.likecoin-button-widget__cta-button {
  display: block;

  box-sizing: border-box;

  width: max-content;
  height: 36px;
  padding: 4px 36px;

  transition-timing-function: ease;
  transition-duration: 0.2s;
  transition-property: border-color, background-color;

  text-decoration: none;

  color: #28646e;
  border-radius: 12px;
  outline: none;

  font-size: 14px;
  font-weight: 600;
}
.likecoin-button-widget__cta-button.likecoin-button-widget__cta-button--default {
  border: 3px solid #aaf1e7;
  background-color: white;
}
.likecoin-button-widget__cta-button.likecoin-button-widget__cta-button--default:hover {
  border-color: #50e3c2;
}
.likecoin-button-widget__cta-button.likecoin-button-widget__cta-button--default:active {
  background-color: #d2f0f0;
}

.likecoin-button-widget__cta-button.likecoin-button-widget__cta-button--special {
  border: none;
  background: linear-gradient(78deg, #d2f0f0, #f0e6b4);
}
.likecoin-button-widget__cta-button.likecoin-button-widget__cta-button--special:hover {
  background: linear-gradient(78deg, #cae6e6, #e9dfae);
}
</style>
