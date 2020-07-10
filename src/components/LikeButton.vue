<template>
  <div
    :class="[
      'like-button',
      'like-button--version-2',
      {
        'like-button--liked': likeCount > 0,
        'like-button--max-like': isLocalMaxLike,
        'like-button--pressed': isPressingKnob,
        'like-button--long-pressed': isLongPressingKnob,
      },
    ]"
  >
    <div>

      <div class="like-button-wrapper">

        <no-ssr>
          <div
            :class="[
              'like-button-slide-track',
              {
                'like-button-slide-track--disabled': !isKnobMovable,
              },
            ]"
            @click="onClickTrack"
          />
        </no-ssr>

        <div
          ref="knobWrapper"
          class="like-button-knob-wrapper"
        >
          <a
            :style="{ marginLeft: `${knobProgress * 100}%` }"
            :href="$attrs.href"
            @mousedown="onPressKnob"
            @mouseup="onPressedKnob"
            @mouseleave="onLeaveKnob"
            @click="onClickKnob"
            ref="button"
            class="like-button-knob"
            target="_blank"
          >
            <no-ssr><ClapEffect ref="clapEffect" /></no-ssr>

            <div class="like-button-knob__border" />
            <transition-group
              class="like-button-knob__content"
              name="like-button-knob__content-"
              tag="div"
              mode="out-in"
            >
              <div key="clap">
                <template v-if="isMax">
                  <div v-if="canSuperLike">
                    SuperLike
                  </div>
                  <div v-else-if="superLikeCooldown > -1">
                    {{ new Date(Date.now() + superLikeCooldown) }}
                  </div>
                  <template v-else>
                    <like-clap-icon />
                  </template>
                </template>
                <template v-else>
                  <like-clap-icon />
                </template>
              </div>
            </transition-group>

            <transition name="like-button__like-count-label-">
              <div
                v-if="hasSuperLiked"
                :class="{
                  'like-button__like-count-label': true,
                }"
              >S</div>
              <div
                v-else-if="likeCount >= 1"
                :class="{
                  'like-button__like-count-label': true,
                  'like-button__like-count-label--max': isMax,
                }"
              >{{ isMax ? 'MAX' : likeCount }}</div>
            </transition>

            <transition name="like-button__like-count-bubble-">
              <div
                v-if="isShowLikeCountBubble && likeCount > 0"
                :class="[
                  'like-button__like-count-bubble',
                  {
                    'like-button__like-count-bubble--max': isMax,
                  }
                ]"
                key="likeCountBubble"
                ref="likeCountBubble"
              >{{ isMax ? 'MAX' : `+${likeCount}` }}</div>
            </transition>
          </a>
        </div>

        <div class="like-button-stats">
          <like-text-icon
            @click="onPressedKnob"
            class="like-button-stats__text-logo"
          />
          <span
            v-if="isShowTotalLike && totalLike > 0"
            @click="$emit('click-stats')"
            class="like-button-stats__total-like"
          >{{ formattedTotalLike }}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import _debounce from 'lodash.debounce';
import { TweenLite, CSSPlugin } from 'gsap/all';

import { checkIsMobileClient } from '~/util/client';

import LikeClapIcon from '~/assets/like-button/like-clap.svg';
import LikeTextIcon from '~/assets/like-button/like-text.svg';

import ClapEffect from './LikeButtonClapEffect';

export default {
  name: 'like-button',
  components: {
    ClapEffect,
    LikeClapIcon,
    LikeTextIcon,
  },
  props: {
    likeCount: {
      type: Number,
      default: 0,
    },
    totalLike: {
      type: Number,
      default: 0,
    },
    isShowTotalLike: {
      type: [Boolean, String],
      default: true,
    },
    canSuperLike: {
      type: Boolean,
      default: false,
    },
    hasSuperLiked: {
      type: Boolean,
      default: false,
    },
    superLikeCooldown: {
      type: Number,
      default: -1,
    },
    isToggled: {
      type: [Boolean, String],
      default: false,
    },
    isTogglable: {
      type: [Boolean, String],
      default: true,
    },
    isMax: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return {
      isShowLikeCountBubble: false,
      isPressingKnob: false,
      isLongPressingKnob: false,
      hasMovedKnob: false,
      lastClientX: 0,
      clientX: 0,
      clampedClientX: 0,
      knobProgress: this.isToggled ? 1 : 0,

      bubbleTimer: null,
      longPressTimer: null,
    };
  },
  computed: {
    formattedTotalLike() {
      let { totalLike } = this;
      let suffix = '';
      if (totalLike > 1000) {
        totalLike = Math.floor(totalLike / 1000);
        suffix = 'k';
      }
      return `${totalLike.toLocaleString('en')}${suffix}`;
    },
    isLocalMaxLike() {
      return this.isTogglable ? this.knobProgress === 1 : this.isMax;
    },
    isKnobMovable() {
      return this.isTogglable && !checkIsMobileClient();
    },
  },
  watch: {
    isToggled(value) {
      this.knobProgress = value && this.isKnobMovable ? 1 : 0;
    },
    knobProgress(value) {
      if (value > 0 && value < 1) {
        this.debouncedSnapKnobProgress();
      }
    },
  },
  created() {
    this.$options.CSSPlugin = CSSPlugin; // make tree shake happy
  },
  mounted() {
    if (this.isKnobMovable) {
      document.addEventListener('mousemove', this.onMovingKnob);
    }
    document.addEventListener('mouseleave', this.onReleaseKnob);
    document.addEventListener('mouseup', this.onReleaseKnob);
  },
  beforeDestroy() {
    if (this.isKnobMovable) {
      document.removeEventListener('mousemove', this.onMovingKnob);
    }
    document.removeEventListener('mouseleave', this.onReleaseKnob);
    document.removeEventListener('mouseup', this.onReleaseKnob);

    if (this.bubbleTimer) {
      clearTimeout(this.bubbleTimer);
      this.bubbleTimer = null;
    }
    if (this.longPressTimer) {
      clearInterval(this.longPressTimer);
      this.longPressTimer = null;
    }
  },
  methods: {
    snapKnobProgress() {
      if (!this.isPressingKnob) {
        this.knobProgress = this.isKnobMovable && this.knobProgress > 0.5 ? 1 : 0;
      }
    },
    debouncedSnapKnobProgress: _debounce(
      // eslint-disable-next-line func-names
      function () { this.snapKnobProgress(); },
      50,
    ),
    setClientX(e) {
      this.clientX = e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
    },
    showLikeCountBubble() {
      this.isShowLikeCountBubble = true;
      if (this.bubbleTimer) clearTimeout(this.bubbleTimer);
      this.bubbleTimer = setTimeout(() => {
        this.isShowLikeCountBubble = false;
      }, 500);

      // If the bubble has already shown, scale the bubble a little bit bigger
      const { likeCountBubble: el } = this.$refs;
      if (el) TweenLite.to(el, 0.1, { scale: 1.1 }).reverse(0);
    },
    clearLongPress() {
      this.isLongPressingKnob = false;
      if (this.longPressTimer) {
        clearInterval(this.longPressTimer);
        this.longPressTimer = null;
      }
    },
    updateKnobProgressByEvent(e) {
      this.lastMoveKnobTimeStamp = e.timeStamp;

      this.setClientX(e);
      const diff = this.clientX - this.lastClientX;
      this.lastClientX = this.clientX;

      const { clientWidth: slidableWidth } = this.$refs.knobWrapper;
      this.clampedClientX = Math.min(Math.max(this.clampedClientX + diff, 0), slidableWidth);
      this.knobProgress = this.clampedClientX / slidableWidth;

      if (!this.hasMovedKnob && Math.abs(diff) > 0) {
        this.hasMovedKnob = true;
      }
    },
    onPressedKnob(e) {
      if (e && e.button !== undefined && e.button !== 0) {
        return; // handle left click only
      }
      if (this.hasMovedKnob) return;

      if (this.isMax && this.isKnobMovable && !this.isLongPressingKnob) {
        this.knobProgress = 1;
      }
      this.$emit('like', e);

      if (this.$refs.clapEffect) {
        this.$refs.clapEffect.animate();
      }

      this.showLikeCountBubble();
    },
    onMovingKnob(e) {
      if (!this.isPressingKnob) return;

      if (requestAnimationFrame) {
        requestAnimationFrame(() => this.updateKnobProgressByEvent(e));
      } else if (!this.hasMovedKnob) {
        this.knobProgress = this.knobProgress > 0.5 ? 0 : 1;
        this.hasMovedKnob = true;
      }
    },
    onClickKnob(e) {
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
    },
    onPressKnob(e) {
      if (checkIsMobileClient()) return;
      if (e && e.button !== undefined && e.button !== 0) {
        return; // handle left click only
      }

      this.setClientX(e);
      this.lastClientX = this.clientX;
      this.isPressingKnob = true;
      this.hasMovedKnob = false;
      if (!this.isLocalMaxLike) {
        this.longPressTimer = setInterval(() => {
          this.isLongPressingKnob = true;
          this.onPressedKnob(e);
        }, 180);
      }
    },
    onReleaseKnob() {
      this.clearLongPress();

      if (!this.isPressingKnob) return;

      this.isPressingKnob = false;
      this.snapKnobProgress();
      this.$emit('toggle', this.isLocalMaxLike);
      this.hasMovedKnob = false;
    },
    onLeaveKnob() {
      this.clearLongPress();
    },
    onClickTrack() {
      this.knobProgress = this.knobProgress > 0.5 ? 0 : 1;
      this.$emit('toggle', this.isLocalMaxLike);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/css/embed";

$like-button-slide-track-width: 108;
$like-button-slide-track-height: 16;
$like-button-size: 80;
$like-button-ring-width: 3;

$like-button-like-count-size: 24;

.like-button {
  &-wrapper {
    position: relative;

    display: flex;
    align-items: flex-start;

    width: normalized($like-button-size);
    height: normalized($like-button-size);

    margin: normalized(10);
    margin-right: normalized(90);
  }

  &-clap-effect {
    margin: normalized(-24);

    fill: $like-green;
  }

  &-slide-track {
    position: relative;

    flex-shrink: 0;

    width: normalized($like-button-slide-track-width);
    padding: normalized(($like-button-size - $like-button-slide-track-height) / 2) normalized(8);

    &:active {
      transform: scale(0.98);
    }

    &--disabled {
      width: normalized($like-button-size + 8);

      &::before {
        display: none;
      }
    }

    &::before {
      display: block;

      height: normalized($like-button-slide-track-height);

      content: '';
      cursor: pointer;

      border-radius: normalized($like-button-slide-track-height);
      background-color: #E6E6E6;

      .like-button--liked:not(.like-button--max-like) & {
        @keyframes sliding-animation {
          0% { background-position-x: 100%; }
          100% { background-position-x: -100%; }
        }

        animation: {
          name: sliding-animation;
          duration: 0.8s;
          timing-function: linear;
          iteration-count: infinite;
          fill-mode: forwards;
        };

        background: {
          image: linear-gradient(to right, #E6E6E6, $like-green);
          size: 200%;
        }
      }
    }
  }

  &-knob {
    &-wrapper {
      position: absolute;
      top: 0;
      left: 0;

      width: normalized(28); // Range for sliding

      pointer-events: none;
    }

    position: relative;

    display: block;

    box-sizing: border-box;
    width: normalized($like-button-size);
    height: normalized($like-button-size);
    padding: normalized($like-button-ring-width);

    cursor: pointer;
    user-select: none;
    -webkit-user-drag: none;

    transition-timing-function: ease;
    transition-duration: 0.2s;
    transition-property: margin-left, color, transform;

    pointer-events: all;

    color: $like-gray-5;
    border: none;
    background: none;

    .like-button-wrapper:hover & {
      color: $like-green;
    }
    .like-button--pressed &,
    .like-button--liked &,
    .like-button--max-like & {
      color: white !important;
    }
    .like-button--pressed & {
      transform: scale(0.95);
    }

    // Border
    &__border {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      content: '';
      transition-timing-function: ease;
      transition-duration: 0.2s;
      transition-property: background, box-shadow, transform;

      border-radius: 50%;
      background: currentColor;

      box-shadow: 0 normalized(2) normalized(6) 0 rgba(0, 0, 0, 0.25);

      .like-button-knob:hover & {
        box-shadow: normalized(2) normalized(4) normalized(6) 0 rgba(0, 0, 0, 0.25);
      }
      .like-button--liked &,
      .like-button--max-like & {
        transform: scale(1.02);
      }
      .like-button-knob:hover &,
      .like-button--pressed & {
        transform: scale(1.05);
      }
      .like-button--pressed &,
      .like-button--liked &,
      .like-button--max-like & {
        background: linear-gradient(47deg, #d2f0f0, #f0e6b4);
        box-shadow: 0 normalized(2) normalized(6) 0 rgba(0, 0, 0, 0.25);
      }
    }

    &__content {
      position: relative;

      width: normalized($like-button-size - $like-button-ring-width * 2);
      height: normalized($like-button-size - $like-button-ring-width * 2);

      transition: background-color 0.2s ease;

      border-radius: 50%;
      background-color: white;

      font-size: normalized(22);
      line-height: normalized(22);

      .like-button--pressed &,
      .like-button--liked &,
      .like-button--max-like & {
        background-color: $like-green;
      }

      &--enter-active,
      &--leave-active {
        transition-duration: 0.25s;
        transition-property: transform, opacity;
      }
      &--enter,
      &--leave-to {
        transform: scale(0);

        opacity: 0;
      }

      > * {
        position: absolute;
        top: normalized(12);
        right: normalized(12);
        bottom: normalized(12);
        left: normalized(12);

        fill: currentColor;

        &.max-label {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .like-button--version-2 & {
      $like-button-ring-width: 4;
      padding: normalized($like-button-ring-width);

      &__content {
        width: normalized($like-button-size - $like-button-ring-width * 2);
        height: normalized($like-button-size - $like-button-ring-width * 2);

        transition: color 0.25s ease;

        color: white;
        background-color: $like-green;
      }

      &__border {
        background: #50e3c2;
      }
    }
    .like-button--version-2.like-button--max-like & {
      &__content {
        color: #50e3c2;
      }
    }
  }

  &__like-count-label {
    position: absolute;
    right: normalized(-2);
    bottom: normalized(-2);

    box-sizing: content-box;
    width: normalized(24);
    height: normalized(24);

    text-align: center;

    color: $like-green;
    border: solid normalized(2) $like-light-blue;
    border-radius: 50%;
    background: white;

    font-size: normalized(12);
    font-weight: 600;
    line-height: normalized(24);

    &-- {
      &enter-active {
        transition-timing-function: ease-out;
        transition-duration: 0.15s;
      }
      &enter {
        transform: scale(0);

        opacity: 0;
      }
    }

    &--max {
      font-size: normalized(8);
    }
  }

  &__like-count-bubble {
    position: absolute;
    bottom: 100%;
    left: normalized(($like-button-size - $like-button-like-count-size) / 2);

    width: normalized($like-button-like-count-size);
    height: normalized($like-button-like-count-size);
    margin-bottom: normalized(16);
    padding: normalized(4);

    transition-property: opacity, transform;
    backface-visibility: hidden;

    text-align: center;

    color: white;
    border-radius: 50%;
    background-color: $like-green;

    font-size: normalized(12);
    font-weight: 600;
    line-height: normalized(16);

    &--max {
      font-size: normalized(7);
    }

    &-- {
      &enter-active {
        transition-timing-function: ease-out;
        transition-duration: 0.15s;
      }
      &leave-active {
        transition-timing-function: ease-in;
        transition-duration: 0.35s;
      }
      &enter {
        transform: scale(0) translateY(normalized(72));

        .like-button--long-pressed & {
          transform: scale(0.9) translateY(normalized(2));
        }
      }
      &leave-to {
        transform: translateY(normalized(-24));
      }
      &enter,
      &leave-to {
        opacity: 0;
      }
    }
  }

  &-stats {
    margin-top: calc(50% - #{normalized(13)});
    margin-left: normalized(12);

    font-size: 0;

    &__text-logo,
    &__total-like {
      display: inline-block;

      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        opacity: 0.75;
      }

      &:active {
        transform: translateY(normalized(1));
      }
    }

    &__text-logo {
      width: normalized(58);
      height: normalized(24);

      fill: $like-gray-5;

      .like-button-wrapper:hover & {
        fill: $like-green;
      }
    }

    &__total-like {
      margin-top: normalized(4);

      color: $like-green;

      font-size: normalized(16);
      font-weight: 600;
    }
  }
}
</style>
