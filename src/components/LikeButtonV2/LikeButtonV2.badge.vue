<!-- eslint-disable max-len -->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 36 36"
    width="36"
  >
    <transition
      :css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <g v-if="!isHidden">
        <g key="count">
          <circle
            :cx="radius"
            :cy="radius"
            :r="radius"
            :style="bgStyle"
          />
          <transition
            :css="false"
            @enter="countLabelEnter"
            @leave="countLabeleave"
          >
            <g :key="`${count}`">
              <text
                :style="countTextStyle"
                x="13"
                y="24"
              >{{ count }}</text>
            </g>
          </transition>
        </g>
        <transition
          :css="false"
          mode="in-out"
          @before-appear="overlayBeforeEnter"
          @appear="overlayEnter"
          @before-enter="overlayBeforeEnter"
          @enter="overlayEnter"
          @leave="overlayLeave"
        >
          <g
            v-if="isMax"
            key="max"
          >
            <circle
              :cx="radius"
              :cy="radius"
              :r="radius"
              :style="bgStyle"
            />
            <text
              :style="maxTextStyle"
              x="4.5"
              y="22"
            >MAX</text>
          </g>
        </transition>
      </g>
    </transition>
  </svg>
</template>
<!-- eslint-enable max-len -->

<script>
import { TweenMax } from 'gsap/all';

export default {
  name: 'like-button-v2-badge',
  props: {
    count: {
      type: Number,
      default: 0,
    },
    maxCount: {
      type: Number,
      default: 5,
    },
  },
  computed: {
    radius() {
      return 18;
    },
    state() {
      if (this.count === 0) {
        return 'hidden';
      }
      return 'liked';
    },
    isHidden() {
      return this.state === 'hidden';
    },
    isLiked() {
      return this.state === 'liked';
    },
    isMax() {
      return this.state === 'max';
    },
    bgStyle() {
      return { fill: '#aaf1e7' };
    },
    baseTextStyle() {
      return {
        fill: '#28646e',
        fontWeight: 'bold',
        fontFamily: 'Source Sans Pro, Arial, sans-serif',
        textAlign: 'center',
      };
    },
    countTextStyle() {
      return {
        ...this.baseTextStyle,
        fontSize: '18px',
      };
    },
    maxTextStyle() {
      return {
        ...this.baseTextStyle,
        fontSize: '12px',
      };
    },
  },
  methods: {
    beforeEnter(el) {
      TweenMax.set(el, { opacity: 0 });
    },
    enter(el, onComplete) {
      TweenMax.fromTo(el, 0.25, {
        scale: 0,
        transformOrigin: '50% 50%',
      }, {
        scale: 1,
        opacity: 1,
        onComplete,
      });
    },
    leave(el, onComplete) {
      TweenMax.to(el, 0.25, {
        scale: 0,
        transformOrigin: '50% 50%',
        opacity: 0,
        onComplete,
      });
    },
    countLabelEnter(el, onComplete) {
      TweenMax.from(el, 0.2, {
        opacity: 0,
        y: 10,
        onComplete,
      });
    },
    countLabeleave(el, onComplete) {
      TweenMax.to(el, 0.2, {
        opacity: 0,
        y: -10,
        onComplete,
      });
    },
    overlayBeforeEnter(el) {
      TweenMax.set(el, { visibility: 'hidden' });
    },
    overlayEnter(el, onComplete) {
      TweenMax.set(el, { visibility: 'visible' });
      TweenMax.from(el, 0.5, {
        opacity: 0,
        scale: 0,
        transformOrigin: '50% 50%',
        delay: 1,
        onComplete,
      });
    },
    overlayLeave(el, onComplete) {
      TweenMax.to(el, 0.25, {
        opacity: 0,
        onComplete,
      });
    },
  },
};
</script>
