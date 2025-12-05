<!-- eslint-disable max-len -->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 156 156"
    width="156"
  >
    <defs>
      <clipPath :id="buttonMaskID">
        <transition
          mode="out-in"
          @before-enter="buttonMaskBeforeEnter"
          @enter="buttonMaskEnter"
          @leave="buttonMaskLeave"
        >
          <path
            v-if="isShowBadge"
            :d="`
              M0,0
              V156
              H156
              V0
              Z
              M120,132
              a22,22,0,1,1,22-22
              A22,22,0,0,1,120,132
              Z
            `"
          />
          <rect
            v-else
            width="156"
            height="156"
          />
        </transition>
      </clipPath>
      <clipPath :id="buttonIconMaskID">
        <circle
          :r="radius"
          cx="78"
          cy="78"
        />
      </clipPath>
    </defs>
    <!-- Button -->
    <g :style="{ clipPath: `url(#${buttonMaskID})` }">
      <g :style="buttonStyle">
        <transition
          :css="false"
          mode="in-out"
          @before-enter="buttonBgBeforeEnter"
          @enter="buttonBgEnter"
          @leave="buttonBgleave"
        >
          <!-- Button Bg -->
          <circle
            :r="radius"
            :style="buttonBgStyle"
            cx="78"
            cy="78"
          />
        </transition>
        <!-- Button Icon -->
        <g
          :style="{
            clipPath: `url(#${buttonIconMaskID})`,
          }"
        >
          <transition
            :css="false"
            @before-enter="buttonIconBeforeEnter"
            @enter="buttonIconEnter"
            @leave="buttonIconleave"
          >
            <!-- Button Read -->
            <g key="read" transform="translate(47, 53) scale(0.5)">
              <path d="M12.64,77.27l0.31-54.92h-6.2v69.88c8.52-2.2,17.07-3.6,25.68-3.66c7.95-0.05,15.9,1.06,23.87,3.76 c-4.95-4.01-10.47-6.96-16.36-8.88c-7.42-2.42-15.44-3.22-23.66-2.52c-1.86,0.15-3.48-1.23-3.64-3.08 C12.62,77.65,12.62,77.46,12.64,77.27L12.64,77.27z M103.62,19.48c-0.02-0.16-0.04-0.33-0.04-0.51c0-0.17,0.01-0.34,0.04-0.51V7.34 c-7.8-0.74-15.84,0.12-22.86,2.78c-6.56,2.49-12.22,6.58-15.9,12.44V85.9c5.72-3.82,11.57-6.96,17.58-9.1 c6.85-2.44,13.89-3.6,21.18-3.02V19.48L103.62,19.48z M110.37,15.6h9.14c1.86,0,3.37,1.51,3.37,3.37v77.66 c0,1.86-1.51,3.37-3.37,3.37c-0.38,0-0.75-0.06-1.09-0.18c-9.4-2.69-18.74-4.48-27.99-4.54c-9.02-0.06-18.03,1.53-27.08,5.52 c-0.56,0.37-1.23,0.57-1.92,0.56c-0.68,0.01-1.35-0.19-1.92-0.56c-9.04-4-18.06-5.58-27.08-5.52c-9.25,0.06-18.58,1.85-27.99,4.54 c-0.34,0.12-0.71,0.18-1.09,0.18C1.51,100.01,0,98.5,0,96.64V18.97c0-1.86,1.51-3.37,3.37-3.37h9.61l0.06-11.26 c0.01-1.62,1.15-2.96,2.68-3.28l0,0c8.87-1.85,19.65-1.39,29.1,2.23c6.53,2.5,12.46,6.49,16.79,12.25 c4.37-5.37,10.21-9.23,16.78-11.72c8.98-3.41,19.34-4.23,29.09-2.8c1.68,0.24,2.88,1.69,2.88,3.33h0V15.6L110.37,15.6z M68.13,91.82c7.45-2.34,14.89-3.3,22.33-3.26c8.61,0.05,17.16,1.46,25.68,3.66V22.35h-5.77v55.22c0,1.86-1.51,3.37-3.37,3.37 c-0.27,0-0.53-0.03-0.78-0.09c-7.38-1.16-14.53-0.2-21.51,2.29C79.09,85.15,73.57,88.15,68.13,91.82L68.13,91.82z M58.12,85.25 V22.46c-3.53-6.23-9.24-10.4-15.69-12.87c-7.31-2.8-15.52-3.43-22.68-2.41l-0.38,66.81c7.81-0.28,15.45,0.71,22.64,3.06 C47.73,78.91,53.15,81.64,58.12,85.25L58.12,85.25z" />
            </g>
          </transition>
        </g>
      </g>
      <foreignObject
        x="40"
        y="40"
        width="76"
        height="76"
      >
        <button
          key="normal"
          :style="buttonStyle"
          v-on="buttonListeners"
        />
      </foreignObject>
    </g>
    <!-- Badge -->
    <svg
      x="102"
      y="92"
      width="36"
      height="36"
    >
      <Badge
        v-bind="{
          count,
          maxCount,
        }"
      />
    </svg>
  </svg>
</template>
<!-- eslint-enable max-len -->

<script>
import { TweenMax } from 'gsap/all';
import Badge from './LikeButtonV2.badge';
import ButtonMixin from '../../mixins/button';

export default {
  name: 'like-button-v2',
  components: {
    Badge,
  },
  mixins: [ButtonMixin],
  props: {
    count: {
      type: Number,
      default: 0,
    },
    maxCount: {
      type: Number,
      default: 5,
    },
    /**
     * An unique ID required if there are 2 or more buttons appears on the same
     * page.
     */
    id: {
      type: String,
      default: undefined,
    },
    explosionSize: {
      type: Number,
      default: 0.65,
    },
    explosionRange: {
      type: Number,
      default: 0.8,
    },
  },
  data() {
    return {
      radius: 38,
    };
  },
  computed: {
    isShowBadge() {
      return this.count > 0;
    },
    idSuffix() {
      return this.id ? `-${this.id}` : '';
    },
    buttonMaskID() {
      return `button-mask${this.idSuffix}`;
    },
    buttonIconMaskID() {
      return `button-icon-mask${this.idSuffix}`;
    },
    buttonStyle() {
      return {
        ...this.buttonBaseStyle,
        transform: `scale(${this.isPressing ? 0.9 : 1})`,
        transition: 'transform 0.25s ease',
        transformOrigin: 'center',
      };
    },
    buttonBgColor() {
      return '#aaf1e7';
    },
    buttonBgStyle() {
      return {
        fill: this.buttonBgColor,
      };
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
    onClickDisabledButton() {
      this.$emit('click-disabled');
    },
    buttonBgBeforeEnter(el) {
      TweenMax.set(el, { opacity: 0 });
    },
    buttonBgEnter(el, done) {
      TweenMax.to(el, 0.5, {
        opacity: 1,
        onComplete: done,
      });
    },
    buttonBgleave(el, done) {
      TweenMax.to(el, 0.5, {
        opacity: 0,
        onComplete: done,
      });
    },
    buttonIconBeforeEnter(el) {
      TweenMax.set(el, { opacity: 0 });
    },
    buttonIconEnter(el, done) {
      TweenMax.fromTo(el, 0.5, {
        scale: 0,
        transformOrigin: '50% 50%',
        onComplete: done,
      }, {
        scale: 1,
        opacity: 1,
      });
    },
    buttonIconleave(el, done) {
      TweenMax.to(el, 0.5, {
        scale: 0,
        opacity: 0,
        transformOrigin: '50% 50%',
        onComplete: done,
      });
    },
    buttonMaskBeforeEnter(el) {
      if (this.isShowBadge) {
        TweenMax.set(el, {
          transformOrigin: '50% 50%',
          scale: 1.4,
        });
      }
    },
    buttonMaskEnter(el, done) {
      if (this.isShowBadge) {
        TweenMax.to(el, 0.25, {
          scale: 1,
          onComplete: done,
        });
      } else {
        done();
      }
    },
    buttonMaskLeave(el, done) {
      if (this.isShowBadge) {
        done();
      } else {
        TweenMax.to(el, 0.25, {
          scale: 1.4,
          transformOrigin: '50% 50%',
          onComplete: done,
        });
      }
    },
  },
};
</script>
