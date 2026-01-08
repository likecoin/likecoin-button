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
            <g key="read">
              <path
                d="m58.937 88.386.121-21.453h-2.422V94.23c3.328-.859 6.668-1.406 10.031-1.43 3.105-.02 6.211.414 9.324 1.469A19.9 19.9 0 0 0 69.6 90.8c-2.898-.945-6.031-1.258-9.242-.984a1.32 1.32 0 0 1-1.422-1.43Zm35.539-22.574a2 2 0 0 1-.016-.199q-.001-.1.016-.199V61.07c-3.047-.289-6.187.047-8.93 1.086-2.562.973-4.773 2.57-6.211 4.859v24.742c2.234-1.492 4.52-2.719 6.867-3.555 2.676-.953 5.426-1.406 8.273-1.18V65.811Zm2.633-1.516h3.574c.727 0 1.316.59 1.316 1.316v30.336a1.316 1.316 0 0 1-1.742 1.246c-3.672-1.051-7.32-1.75-10.934-1.773-3.523-.023-7.043.598-10.578 2.156-.219.145-.48.223-.75.219a1.34 1.34 0 0 1-.75-.219c-3.531-1.562-7.055-2.18-10.578-2.156-3.613.023-7.258.723-10.934 1.773q-.201.07-.426.07a1.31 1.31 0 0 1-1.309-1.312v-30.34c0-.727.59-1.316 1.316-1.316h3.754l.023-4.398a1.314 1.314 0 0 1 1.047-1.281c3.465-.723 7.676-.543 11.367.871 2.551.977 4.867 2.535 6.559 4.785 1.707-2.098 3.988-3.605 6.555-4.578 3.508-1.332 7.555-1.652 11.363-1.094.656.094 1.125.66 1.125 1.301v4.395ZM80.613 94.069c2.91-.914 5.816-1.289 8.723-1.273 3.363.02 6.703.57 10.031 1.43V66.933h-2.254v21.57a1.316 1.316 0 0 1-1.621 1.281c-2.883-.453-5.676-.078-8.402.895-2.195.785-4.352 1.957-6.477 3.391Zm-3.91-2.566V66.976c-1.379-2.434-3.609-4.062-6.129-5.027-2.855-1.094-6.062-1.34-8.859-.941l-.148 26.098c3.051-.109 6.035.277 8.844 1.195a22.6 22.6 0 0 1 6.293 3.203Z"
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
