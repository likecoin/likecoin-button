<!-- eslint-disable max-len -->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 36 36"
    width="36"
  >
    <transition
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
      :css="false"
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
            @enter="countLabelEnter"
            @leave="countLabeleave"
            :css="false"
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
          @before-appear="overlayBeforeEnter"
          @apper="overlayEnter"
          @before-enter="overlayBeforeEnter"
          @enter="overlayEnter"
          @leave="overlayLeave"
          :css="false"
          mode="in-out"
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
          <g
            v-else-if="isShareable || isShared"
            :style="{
              fill: shareIconContentColor,
              fillRule: 'evenodd',
            }"
            key="share-icon"
          >
            <transition
              @before-enter="shareIconBgBeforeEnter"
              @enter="shareIconBgEnter"
              @leave="shareIconBgLeave"
              :css="false"
              mode="in-out"
            >
              <circle
                :key="state"
                :cx="radius"
                :cy="radius"
                :r="radius"
                :style="{
                  fill: shareIconBgColor,
                }"
              />
            </transition>
            <transition
              @enter="shareIconContentEnter"
              @leave="shareIconContentLeave"
              :css="false"
            >
              <g :key="state">
                <path d="M13.13,15.11a2,2,0,1,0-2-2A2,2,0,0,0,13.13,15.11Z" />
                <path d="M11,19.51a1.23,1.23,0,0,1,1.08-1.24,7.23,7.23,0,0,0,6.19-6.19,1.25,1.25,0,1,1,2.48.34,9.76,9.76,0,0,1-8.34,8.33A1.25,1.25,0,0,1,11,19.68,1,1,0,0,1,11,19.51Z" />
                <path d="M11,24.8a1.24,1.24,0,0,1,1.15-1.24A12.42,12.42,0,0,0,23.58,12.15a1.25,1.25,0,0,1,2.5.2,14.93,14.93,0,0,1-13.73,13.7A1.25,1.25,0,0,1,11,24.91Z" />
              </g>
            </transition>
          </g>
        </transition>
      </g>
    </transition>
  </svg>
</template>
<!-- eslint-enable max-len -->

<script>
import { TimelineMax, TweenMax } from 'gsap/all';

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
    hasSuperLiked: {
      type: Boolean,
      default: false,
    },
    isSuperLikeEnabled: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    radius() {
      return 18;
    },
    state() {
      if (this.count > 0) {
        if (this.count >= this.maxCount) {
          if (this.isSuperLikeEnabled) {
            if (this.hasSuperLiked) {
              return 'shared';
            }
            return 'shareable';
          }
          return 'max';
        }
        return 'liked';
      }
      return 'hidden';
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
    isShareable() {
      return this.state === 'shareable';
    },
    isShared() {
      return this.state === 'shared';
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
    shareIconBgColor() {
      return this.hasSuperLiked ? '#50e3c2' : '#e6e6e6';
    },
    shareIconContentColor() {
      return this.hasSuperLiked ? '#28646e' : '#9b9b9b';
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
    shareIconBgBeforeEnter(el) {
      TweenMax.set(el, { opacity: 0 });
    },
    shareIconBgEnter(el, onComplete) {
      TweenMax.to(el, 0.25, {
        opacity: 1,
        onComplete,
      });
    },
    shareIconBgLeave(el, onComplete) {
      TweenMax.to(el, 0, {
        opacity: 0,
        delay: 0.25,
        onComplete,
      });
    },
    shareIconContentEnter(el, onComplete) {
      const tl = new TimelineMax({ onComplete });
      if (this.isShareable) {
        tl.from(el, 0.25, { opacity: 0 });
      } else {
        tl.from(el.children, 0.25, {
          opacity: 0,
          delay: 0.25,
          stagger: 0.2,
        });
      }
    },
    shareIconContentLeave(el, onComplete) {
      const tl = new TimelineMax({ onComplete });
      if (this.isShared) {
        tl.to(el.children, 0.25, {
          opacity: 0,
          stagger: 0.2,
        });
      } else {
        tl.to(el, 0.25, { opacity: 0 });
      }
    },
  },
};
</script>
