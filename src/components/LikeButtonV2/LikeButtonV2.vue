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
            <!-- Button Clap -->
            <g
              key="clap"
            >
              <path
                d="M75.1,69.7a1.09,1.09,0,0,1-.9-.4,1.24,1.24,0,0,1,.1-1.7,25.87,25.87,0,0,0,5.2-5.9,4.41,4.41,0,0,1,4.3-2.4,1.22,1.22,0,1,1-.4,2.4,2.11,2.11,0,0,0-1.9,1.2,29.54,29.54,0,0,1-5.7,6.6,1.45,1.45,0,0,1-.7.2M54.6,90.1a1.09,1.09,0,0,1-.9-.4,1.16,1.16,0,0,1,.2-1.7,29.17,29.17,0,0,1,4.5-3,1.19,1.19,0,1,1,1.1,2.1,35.24,35.24,0,0,0-4,2.7,1.9,1.9,0,0,1-.9.3M85.2,78.7c.5.4,1,.3,1.6-.2a45,45,0,0,0,8.5-11.3,1.12,1.12,0,0,1,1.4-.7c.7.3.7,1.4.1,2.7a44,44,0,0,1-8.3,11.6,1,1,0,0,0,0,1.4c.4.4,1,.3,1.6-.3a48.69,48.69,0,0,0,5.2-6,1.13,1.13,0,0,1,1.2-.6c.6.1.7.7.5,1.3-.3,1.1-3.4,5.1-4.6,6.4-3.3,3.7-6.6,5.7-13,8.9-2.2,1.1-3.9,2.2-4.9,3.9-.9,1.5-1.2,2-1.3,2.2a1.42,1.42,0,0,0,.7,2,1.27,1.27,0,0,0,.6.1,1.51,1.51,0,0,0,1.4-.9l1.1-2a8.74,8.74,0,0,1,3.7-3.3,37.77,37.77,0,0,0,12.7-8.8A42.16,42.16,0,0,0,98,78.8c1.8-3,.8-5.5-.8-5.9a.19.19,0,0,1-.1-.3,16,16,0,0,0,2-4.7c.3-1.5-.1-3.4-2.2-3.9-.1,0-.2-.1-.2-.3.1-.5.3-1.1.4-1.5a3.38,3.38,0,0,0-2.4-4.1,3.7,3.7,0,0,0-2.9.6.3.3,0,0,1-.4,0,2,2,0,0,0-1.6-.7,3.69,3.69,0,0,0-3.6,2.4,24.75,24.75,0,0,1-4.7,6.7,51.91,51.91,0,0,1-9,7.6c-.4.3-1,.2-.9-.3.1-.9,1.1-6.8,1.2-8.6.3-2.8-1.3-4.1-3-4.4-1.4-.2-3.6.2-4.8,3.4a82.33,82.33,0,0,0-3.4,10,29.52,29.52,0,0,0-.2,12.3,1.08,1.08,0,0,1-.2.8c-.9,1.5-2.3,3.6-3.1,5.3a1.43,1.43,0,0,0,.6,1.9,1.85,1.85,0,0,0,.7.2,1.51,1.51,0,0,0,1.4-.9c.5-1,1.4-2.8,1.8-3.5a20.83,20.83,0,0,0,1.2-2.7,3.71,3.71,0,0,0,0-2.4,23.82,23.82,0,0,1,.2-9.9,96.1,96.1,0,0,1,3.6-11.1c.4-.9.9-1.2,1.4-1.1s1.5.3,1.2,2.1c-.5,3.3-1.2,7.4-1.4,8.8-.1.7-.2,2.3,1,3,1,.6,2.1.3,3.3-.5a59.55,59.55,0,0,0,10.3-8.7,21.65,21.65,0,0,0,4.8-7.3,1.4,1.4,0,0,1,1.6-.7c.3.1.7.5.4,1.5-.7,2.3-3.5,7.4-8.9,12.3a1,1,0,0,0-.2,1.5,1.07,1.07,0,0,0,1.5,0A35.09,35.09,0,0,0,91.5,64a25.54,25.54,0,0,0,1.1-2.7,1.38,1.38,0,0,1,1.3-1c.6.1,1,.7.8,1.7a23.94,23.94,0,0,1-1.3,3.7A51.66,51.66,0,0,1,85,77.1a1.38,1.38,0,0,0,.2,1.6m-22-16.4a.51.51,0,0,0,.1-.5c-.3-.8-1.8-4.3-2.1-5-.2-.3-.4-.4-.7-.3a6.29,6.29,0,0,0-1.5,1,6,6,0,0,0-1.2,1.3.53.53,0,0,0,.2.7,53,53,0,0,0,4.7,2.8.33.33,0,0,0,.5,0Zm-1.3,2.3c0-.2-.3-.3-.4-.3-.9-.2-4.6-.7-5.4-.8-.4,0-.6.2-.6.4a6.05,6.05,0,0,0,.1,1.8,5.85,5.85,0,0,0,.5,1.7.48.48,0,0,0,.7.2c.7-.3,4.1-2.1,4.8-2.6.1,0,.3-.1.3-.4ZM90.1,93c-.2,0-.3.2-.4.4-.3.8-1.2,4.5-1.4,5.3a.53.53,0,0,0,.4.7,8.16,8.16,0,0,0,1.8.1,5.94,5.94,0,0,0,1.8-.3c.3-.1.4-.3.3-.7a31.15,31.15,0,0,0-2.1-5c0-.3-.1-.5-.4-.5Zm2.2-1.7a.44.44,0,0,0,.1.5,46.83,46.83,0,0,0,3.8,3.9.52.52,0,0,0,.8,0,5.4,5.4,0,0,0,1-1.5,12.83,12.83,0,0,0,.7-1.6c0-.3-.1-.5-.5-.6-.8-.2-4.5-.8-5.4-.9-.2,0-.4,0-.5.2Z"
                style="fill: #28646e"
              />
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
          isCreator,
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
    isCreator: {
      type: Boolean,
      default: false,
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
      return this.isCreator || this.count > 0;
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
