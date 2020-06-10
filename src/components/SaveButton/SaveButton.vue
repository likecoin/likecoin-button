<!-- eslint-disable max-len -->
<template>
  <svg
    :viewBox="`0 0 ${size} ${size}`"
    :width="size"
    :height="size"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <clipPath id="save-icon-mask">
        <path :d="iconPath" />
      </clipPath>
      <clipPath id="save-button-mask">
        <circle
          :cx="radius"
          :cy="radius"
          :r="radius"
        />
      </clipPath>
    </defs>
    <g :style="svgStyle">
      <circle
        :cx="radius"
        :cy="radius"
        :r="radius"
        fill="#aaf1e7"
      />
      <transition
        v-if="isHovering"
        @before-appear="hoverRimBeforeEnter"
        @appear="hoverRimEnter"
        @before-enter="hoverRimBeforeEnter"
        @enter="hoverRimEnter"
        @leave="hoverRimLeave"
        :css="false"
      >
        <circle
          :cx="radius"
          :cy="radius"
          :r="radius"
          stroke="#50e3c2"
          stroke-width="4"
          fill="none"
        />
      </transition>
      <g style="clip-path: url(#save-icon-mask)">
        <transition
          v-if="toggled"
          @before-appear="iconFillBeforeEnter"
          @appear="iconFillEnter"
          @before-enter="iconFillBeforeEnter"
          @enter="iconFillEnter"
          @leave="iconFillLeave"
          :css="false"
        >
          <rect
            :fill="iconFill"
            x="14"
            y="12"
            width="16"
            height="22"
          />
        </transition>
        <path
          :d="iconPath"
          :stroke="iconFill"
          stroke-width="4"
          fill="none"
        />
      </g>
      <foreignObject
        :width="size"
        :height="size"
      >
        <button
          :style="buttonStyle"
          @mouseover="onMouseOver"
          @mouseleave="onMouseLeave"
          @mousedown="onPressDown"
          @mouseup="onPressUp"
          @touchstart="onTouchStart"
          @touchend="onTouchEnd"
          @click="onClick"
        />
      </foreignObject>
    </g>
  </svg>
</template>
<!-- eslint-enable max-len -->

<script>
import { TweenMax } from 'gsap/all';

export default {
  name: 'bookmark-button',
  props: {
    toggled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isHovering: false,
      isPressing: false,
    };
  },
  computed: {
    size() {
      return 44;
    },
    radius() {
      return this.size / 2;
    },
    buttonKey() {
      return this.isPressing ? 'pressed' : 'normal';
    },
    buttonPressedScale() {
      return 0.85;
    },
    buttonStyle() {
      return {
        display: 'block',
        border: 'none',
        background: 'none',
        outline: 'none',
        userSelect: 'none',
        margin: 0,
        padding: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
      };
    },
    iconFill() {
      return '#28646e';
    },
    iconPath() {
      return 'M26.9,12.7H16.6c-1.5,0-2.6,1.2-2.6,2.6v17.4l7.8-5.1l7.8,5.1V15.4C29.6,13.9,28.4,12.7,26.9,12.7z';
    },
    svgStyle() {
      return {
        clipPath: 'url(#save-button-mask)',
        transform: `scale(${this.isPressing ? this.buttonPressedScale : 1})`,
        transformOrigin: '50% 50%',
        transition: 'transform 0.2s ease',
      };
    },
  },
  methods: {
    onMouseOver() {
      this.isHovering = true;
    },
    onMouseLeave() {
      this.isHovering = false;
      this.isPressing = false;
    },
    onPressDown() {
      this.isPressing = true;
    },
    onPressUp() {
      this.isPressing = false;
    },
    onTouchStart() {
      this.isHovering = true;
      this.isPressing = true;
    },
    onTouchEnd() {
      this.isHovering = false;
      this.isPressing = false;
    },
    onClick() {
      this.$emit('click');
    },
    hoverRimBeforeEnter(el) {
      TweenMax.set(el, { opacity: 0 });
    },
    hoverRimEnter(el, onComplete) {
      TweenMax.fromTo(el, 0.25, {
        scale: 1.1,
        transformOrigin: '50% 50%',
      }, {
        opacity: 1,
        scale: 1,
        onComplete,
      });
    },
    hoverRimLeave(el, onComplete) {
      TweenMax.to(el, 0.2, {
        scale: 1.1,
        opacity: 0,
        transformOrigin: '50% 50%',
        onComplete,
      });
    },
    iconFillBeforeEnter(el) {
      TweenMax.set(el, { scaleY: 0 });
    },
    iconFillEnter(el, onComplete) {
      TweenMax.to(el, 0.25, {
        scaleY: 1,
        onComplete,
      });
    },
    iconFillLeave(el, onComplete) {
      TweenMax.to(el, 0.2, {
        scaleY: 0,
        onComplete,
      });
    },
  },
};
</script>
