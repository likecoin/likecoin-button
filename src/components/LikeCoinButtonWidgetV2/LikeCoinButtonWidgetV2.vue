<template>
  <div :style="rootStyle">
    <hr
      v-if="isStickyBottomLayout"
      :style="hrStyle"
    >
    <svg
      :style="svgStyle"
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="`0 0 ${width} 180`"
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
          <a
            :style="labelButtonStyle"
            class="likecoin-button-widget__label-button"
            :href="statUrl"
            @click.prevent="$emit('click-like-button-label')"
          >{{ likeButtonLabel }}</a>
        </div>
      </foreignObject>

      <foreignObject
        v-if="isShowHintLabel"
        :x="saveSlotProps.x"
        y="0"
        width="212"
        height="60"
      >
        <a
          v-if="!isLoggedIn"
          target="_blank"
          rel="noopener"
          :href="signUpHref"
          :style="hintLabelStyle"
        >
          {{ hintLabel }}
        </a>
        <div v-else :style="hintLabelStyle">{{ hintLabel }}</div>
      </foreignObject>

      <!-- Upgrade -->
      <foreignObject
        v-if="upgradeHref"
        :x="upgradeLabelX"
        :y="upgradeLabelY"
        width="120"
        height="30"
      >
        <a
          :href="upgradeHref"
          target="_blank"
          rel="noopener"
          :style="upgradeLabelStyle"
        >
          {{ $t('HintLabel.Upgrade') }}
        </a>
      </foreignObject>

      <!-- CTA -->
      <foreignObject
        v-if="shouldShowCta"
        :x="saveSlotProps.x"
        :y="saveSlotProps.y"
        width="212"
        height="36"
      >
        <a
          :class="ctaButtonClass"
          :href="ctaHref || depupSpaceUrl"
          target="_blank"
          rel="noreferrer noopener"
          @click="$emit('click-cta-button')"
        >
          <lc-loading-indicator
            v-if="!ctaHref"
            :style="labelStyle"
          />
          <div v-else>{{ ctaButtonLabel }}</div>
        </a>
      </foreignObject>

      <foreignObject
        x="324"
        y="144"
        width="16"
        height="16"
      >
        <a
          :href="likerLandUrl"
          :style="textStyle"
          target="_blank"
          rel="noopener"
        >
          <like-question-icon />
        </a>
      </foreignObject>
    </svg>
  </div>
</template>

<script>
import LikeQuestionIcon from '~/assets/like-button/question-btn.svg';
import Identity from '../Identity/Identity';
import LikeButton from '../LikeButtonV2/LikeButtonV2';

import { DEPUB_SPACE_URL, LIKER_LAND_URL_BASE } from '../../constant';

export const LAYOUT_DEFAULT = 'default';
export const LAYOUT_STICKY_BOTTOM = 'sticky-bottom';
export const LAYOUTS = [LAYOUT_DEFAULT, LAYOUT_STICKY_BOTTOM];

export default {
  name: 'likecoin-button-widget',
  components: {
    Identity,
    LikeButton,
    LikeQuestionIcon,
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
    ctaHref: {
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
    hintLabel: {
      type: String,
      default: undefined,
    },
    signUpHref: {
      type: String,
      default: '',
    },
    upgradeHref: {
      type: String,
      default: '',
    },
    isShowLikeButton: {
      type: Boolean,
      default: true,
    },
    isLoggedIn: {
      type: Boolean,
      default: true,
    },
    shouldShowCta: {
      type: Boolean,
      default: false,
    },
    statUrl: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 360,
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
        style.maxWidth = '280px';
      } else {
        style.maxWidth = `${this.width}px`;
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
        y: 130,
      };
    },
    upgradeLabelX() {
      return 108;
    },
    upgradeLabelY() {
      return 115;
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
        margin: 'auto',
        marginTop: '3px',
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
    upgradeLabelStyle() {
      return {
        ...this.textStyle,
        fontSize: '8px',
      };
    },
    ctaButtonClass() {
      return [
        'likecoin-button-widget__cta-button',
        `likecoin-button-widget__cta-button--${this.ctaButtonPreset}`,
      ];
    },
    depupSpaceUrl() {
      return DEPUB_SPACE_URL;
    },
    likerLandUrl() {
      return LIKER_LAND_URL_BASE;
    },
  },
};
</script>
