<!-- eslint-disable max-len -->
<template>
  <button
    :style="buttonStyle"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
    @mousedown="onPressDown"
    @mouseup="onPressUp"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @click="onClick"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 44 44"
      width="44"
    >
      <defs>
        <clipPath id="icon-mask">
          <path d="M26.92,12.72H16.64A2.64,2.64,0,0,0,14,15.36V32.72l7.78-5.09,7.78,5.09V15.36A2.64,2.64,0,0,0,26.92,12.72Z" />
        </clipPath>
      </defs>
      <circle
        cx="22"
        cy="22"
        r="22"
        fill="#aaf1e7"
      />
      <transition
        v-if="isHovering"
        @before-appear="hoverBgBeforeEnter"
        @appear="hoverBgEnter"
        @before-enter="hoverBgBeforeEnter"
        @enter="hoverBgEnter"
        @leave="hoverBgLeave"
        :css="false"
      >
        <circle
          cx="22"
          cy="22"
          r="22"
          fill="#50e3c2"
        />
      </transition>
      <g style="clip-path: url(#icon-mask)">
        <transition
          v-if="(isPressing && !toggled) || (!isPressing && toggled)"
          @before-appear="iconFillBeforeEnter"
          @appear="iconFillEnter"
          @before-enter="iconFillBeforeEnter"
          @enter="iconFillEnter"
          @leave="iconFillLeave"
          :css="false"
        >
          <circle
            cx="22"
            cy="22"
            r="22"
            fill="#28646e"
          />
        </transition>
        <path
          d="M26.92,14.72a.64.64,0,0,1,.64.64V29L22.87,26l-1.09-.72-1.1.72L16,29V15.36a.64.64,0,0,1,.64-.64H26.92m0-2H16.64A2.64,2.64,0,0,0,14,15.36V32.72l7.78-5.09,7.78,5.09V15.36a2.64,2.64,0,0,0-2.64-2.64Z"
          fill="#28646e"
        />
      </g>
    </svg>
  </button>
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
    buttonKey() {
      return this.isPressing ? 'pressed' : 'normal';
    },
    buttonPressedScale() {
      return 0.85;
    },
    buttonStyle() {
      return {
        border: 'none',
        background: 'none',
        outline: 'none',
        userSelect: 'none',
        margin: 0,
        padding: 0,
        transform: `scale(${this.isPressing ? this.buttonPressedScale : 1})`,
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
    hoverBgBeforeEnter(el) {
      TweenMax.set(el, { opacity: 0 });
    },
    hoverBgEnter(el, onComplete) {
      TweenMax.fromTo(el, 0.25, {
        scale: 0.4,
        transformOrigin: '50% 50%',
      }, {
        opacity: 1,
        scale: 1,
        onComplete,
      });
    },
    hoverBgLeave(el, onComplete) {
      TweenMax.to(el, 0.2, {
        scale: 0,
        transformOrigin: '50% 50%',
        onComplete,
      });
    },
    iconFillBeforeEnter(el) {
      TweenMax.set(el, { opacity: 0 });
    },
    iconFillEnter(el, onComplete) {
      TweenMax.fromTo(el, 0.25, {
        scale: 0,
        transformOrigin: '50% 50%',
      }, {
        opacity: 1,
        scale: 1,
        onComplete,
      });
    },
    iconFillLeave(el, onComplete) {
      TweenMax.to(el, 0.2, {
        scale: 0,
        transformOrigin: '50% 50%',
        onComplete,
      });
    },
  },
};
</script>
