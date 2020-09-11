<!-- eslint-disable max-len -->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 156 156"
    width="156"
  >
    <defs>
      <clipPath id="button-mask">
        <transition
          @before-enter="buttonMaskBeforeEnter"
          @enter="buttonMaskEnter"
          @leave="buttonMaskLeave"
          mode="out-in"
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
      <clipPath id="button-icon-mask">
        <circle
          :r="radius"
          cx="78"
          cy="78"
        />
      </clipPath>
    </defs>
    <!-- Button -->
    <g :style="{ clipPath: 'url(#button-mask)' }">
      <g :style="buttonStyle">
        <transition
          @before-enter="buttonBgBeforeEnter"
          @enter="buttonBgEnter"
          @leave="buttonBgleave"
          :css="false"
          mode="in-out"
        >
          <!-- Button Bg -->
          <circle
            :key="state"
            :r="radius"
            :style="buttonBgStyle"
            cx="78"
            cy="78"
          />
        </transition>
        <!-- Button Icon -->
        <g
          :style="{
            clipPath: 'url(#button-icon-mask)',
          }"
        >
          <transition
            @before-enter="buttonIconBeforeEnter"
            @enter="buttonIconEnter"
            @leave="buttonIconleave"
            :css="false"
          >
            <!-- Button Clap -->
            <g
              v-if="state === 'initial' || state === 'max'"
              key="clap"
            >
              <path
                d="M75.1,69.7a1.09,1.09,0,0,1-.9-.4,1.24,1.24,0,0,1,.1-1.7,25.87,25.87,0,0,0,5.2-5.9,4.41,4.41,0,0,1,4.3-2.4,1.22,1.22,0,1,1-.4,2.4,2.11,2.11,0,0,0-1.9,1.2,29.54,29.54,0,0,1-5.7,6.6,1.45,1.45,0,0,1-.7.2M54.6,90.1a1.09,1.09,0,0,1-.9-.4,1.16,1.16,0,0,1,.2-1.7,29.17,29.17,0,0,1,4.5-3,1.19,1.19,0,1,1,1.1,2.1,35.24,35.24,0,0,0-4,2.7,1.9,1.9,0,0,1-.9.3M85.2,78.7c.5.4,1,.3,1.6-.2a45,45,0,0,0,8.5-11.3,1.12,1.12,0,0,1,1.4-.7c.7.3.7,1.4.1,2.7a44,44,0,0,1-8.3,11.6,1,1,0,0,0,0,1.4c.4.4,1,.3,1.6-.3a48.69,48.69,0,0,0,5.2-6,1.13,1.13,0,0,1,1.2-.6c.6.1.7.7.5,1.3-.3,1.1-3.4,5.1-4.6,6.4-3.3,3.7-6.6,5.7-13,8.9-2.2,1.1-3.9,2.2-4.9,3.9-.9,1.5-1.2,2-1.3,2.2a1.42,1.42,0,0,0,.7,2,1.27,1.27,0,0,0,.6.1,1.51,1.51,0,0,0,1.4-.9l1.1-2a8.74,8.74,0,0,1,3.7-3.3,37.77,37.77,0,0,0,12.7-8.8A42.16,42.16,0,0,0,98,78.8c1.8-3,.8-5.5-.8-5.9a.19.19,0,0,1-.1-.3,16,16,0,0,0,2-4.7c.3-1.5-.1-3.4-2.2-3.9-.1,0-.2-.1-.2-.3.1-.5.3-1.1.4-1.5a3.38,3.38,0,0,0-2.4-4.1,3.7,3.7,0,0,0-2.9.6.3.3,0,0,1-.4,0,2,2,0,0,0-1.6-.7,3.69,3.69,0,0,0-3.6,2.4,24.75,24.75,0,0,1-4.7,6.7,51.91,51.91,0,0,1-9,7.6c-.4.3-1,.2-.9-.3.1-.9,1.1-6.8,1.2-8.6.3-2.8-1.3-4.1-3-4.4-1.4-.2-3.6.2-4.8,3.4a82.33,82.33,0,0,0-3.4,10,29.52,29.52,0,0,0-.2,12.3,1.08,1.08,0,0,1-.2.8c-.9,1.5-2.3,3.6-3.1,5.3a1.43,1.43,0,0,0,.6,1.9,1.85,1.85,0,0,0,.7.2,1.51,1.51,0,0,0,1.4-.9c.5-1,1.4-2.8,1.8-3.5a20.83,20.83,0,0,0,1.2-2.7,3.71,3.71,0,0,0,0-2.4,23.82,23.82,0,0,1,.2-9.9,96.1,96.1,0,0,1,3.6-11.1c.4-.9.9-1.2,1.4-1.1s1.5.3,1.2,2.1c-.5,3.3-1.2,7.4-1.4,8.8-.1.7-.2,2.3,1,3,1,.6,2.1.3,3.3-.5a59.55,59.55,0,0,0,10.3-8.7,21.65,21.65,0,0,0,4.8-7.3,1.4,1.4,0,0,1,1.6-.7c.3.1.7.5.4,1.5-.7,2.3-3.5,7.4-8.9,12.3a1,1,0,0,0-.2,1.5,1.07,1.07,0,0,0,1.5,0A35.09,35.09,0,0,0,91.5,64a25.54,25.54,0,0,0,1.1-2.7,1.38,1.38,0,0,1,1.3-1c.6.1,1,.7.8,1.7a23.94,23.94,0,0,1-1.3,3.7A51.66,51.66,0,0,1,85,77.1a1.38,1.38,0,0,0,.2,1.6m-22-16.4a.51.51,0,0,0,.1-.5c-.3-.8-1.8-4.3-2.1-5-.2-.3-.4-.4-.7-.3a6.29,6.29,0,0,0-1.5,1,6,6,0,0,0-1.2,1.3.53.53,0,0,0,.2.7,53,53,0,0,0,4.7,2.8.33.33,0,0,0,.5,0Zm-1.3,2.3c0-.2-.3-.3-.4-.3-.9-.2-4.6-.7-5.4-.8-.4,0-.6.2-.6.4a6.05,6.05,0,0,0,.1,1.8,5.85,5.85,0,0,0,.5,1.7.48.48,0,0,0,.7.2c.7-.3,4.1-2.1,4.8-2.6.1,0,.3-.1.3-.4ZM90.1,93c-.2,0-.3.2-.4.4-.3.8-1.2,4.5-1.4,5.3a.53.53,0,0,0,.4.7,8.16,8.16,0,0,0,1.8.1,5.94,5.94,0,0,0,1.8-.3c.3-.1.4-.3.3-.7a31.15,31.15,0,0,0-2.1-5c0-.3-.1-.5-.4-.5Zm2.2-1.7a.44.44,0,0,0,.1.5,46.83,46.83,0,0,0,3.8,3.9.52.52,0,0,0,.8,0,5.4,5.4,0,0,0,1-1.5,12.83,12.83,0,0,0,.7-1.6c0-.3-.1-.5-.5-.6-.8-.2-4.5-.8-5.4-.9-.2,0-.4,0-.5.2Z"
                style="fill: #28646e"
              />
            </g>
            <g
              v-else
              key="star"
            >
              <!-- Button Star -->
              <transition
                @enter="starIconEnter"
                @leave="starIconleave"
                :css="false"
              >
                <g :key="state">
                  <!-- Star Bits -->
                  <StarBits
                    v-if="isShowStarBits"
                    @end="isShowStarBits = false"
                  />
                  <path
                    :style="{
                      fill: superLikeIconFill,
                      stroke: superLikeIconStroke,
                      strokeWidth: '3px',
                    }"
                    d="M80,65.38l2.62,5.3a2.27,2.27,0,0,0,1.69,1.23l5.85.85a2.25,2.25,0,0,1,1.25,3.84l-4.23,4.12a2.24,2.24,0,0,0-.65,2l1,5.83a2.25,2.25,0,0,1-3.27,2.37L79,88.16a2.27,2.27,0,0,0-2.09,0l-5.23,2.75a2.25,2.25,0,0,1-3.27-2.37l1-5.83a2.24,2.24,0,0,0-.65-2L64.51,76.6a2.25,2.25,0,0,1,1.25-3.84l5.85-.85a2.27,2.27,0,0,0,1.69-1.23l2.62-5.3A2.25,2.25,0,0,1,80,65.38Z"
                  />
                  <!-- Tick -->
                  <polyline
                    v-if="isShowSuperLikeTick"
                    points="73.38 80.35 76.68 83.18 82.8 75.76"
                    style="fill: none;stroke: #28646e;stroke-linecap: round;stroke-linejoin: round;stroke-width: 3px;fill-rule: evenodd"
                  />
                  <!-- Button Star Trail -->
                  <g
                    v-else
                    :style="{
                      fill: 'none',
                      stroke: superLikeIconStroke,
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                      strokeWidth: '3px'
                    }"
                  >
                    <line
                      x1="72"
                      y1="98"
                      x2="72"
                      y2="102"
                    />
                    <line
                      x1="84"
                      y1="98"
                      x2="84"
                      y2="102"
                    />
                    <line
                      x1="78"
                      y1="100"
                      x2="78"
                      y2="104"
                    />
                  </g>
                </g>
              </transition>
            </g>
          </transition>
        </g>
        <Cooldown
          :value="cooldownValue"
          :end-time="cooldownEndTime"
          :color="cooldownFillColor"
          :radius="radius"
          :center="78"
          :is-bold="!isDisabled && isHovering"
          @end="onCooldownEnd"
          ref="cooldown"
        />
      </g>
      <foreignObject
        x="40"
        y="40"
        width="76"
        height="76"
      >
        <button
          v-if="!isDisabled"
          :style="buttonStyle"
          v-on="buttonListeners"
          key="normal"
        />
        <button
          v-else
          :style="buttonStyle"
          @click="onClickDisabledButton"
          key="disabled"
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
          hasSuperLiked,
          isSuperLikeEnabled,
          isCreator,
        }"
      />
    </svg>
    <!-- Clap Bits -->
    <ClapBits
      v-for="id in clapBits"
      :key="id"
      v-bind="{
        id,
        explosionSize,
        explosionRange,
      }"
      @end="finishClapBitsAnimation"
    />
  </svg>
</template>
<!-- eslint-enable max-len -->

<script>
import { TimelineMax, TweenMax } from 'gsap/all';
import Badge from './LikeButtonV2.badge';
import ClapBits from './LikeButtonV2.clapBits';
import Cooldown from './LikeButtonV2.cooldown';
import StarBits from './LikeButtonV2.starBits';
import ButtonMixin from '../../mixins/button';

export default {
  name: 'like-button-v2',
  components: {
    Badge,
    ClapBits,
    Cooldown,
    StarBits,
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
    cooldown: {
      type: Number,
      default: 0,
    },
    cooldownEndTime: {
      type: Number,
      default: 0,
    },
    hasSuperLiked: {
      type: Boolean,
      default: false,
    },
    isJustSuperLiked: {
      type: Boolean,
      default: false,
    },
    isSuperLikeEnabled: {
      type: Boolean,
      default: true,
    },
    isCreator: {
      type: Boolean,
      default: false,
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
      hasBlockingAnimation: false,
      clapBits: [],
      isShowStarBits: false,
    };
  },
  computed: {
    state() {
      if (!this.isCreator && this.count < this.maxCount) {
        return 'initial';
      }
      if (!this.isSuperLikeEnabled) {
        return 'unsuperlikeable';
      }
      if (this.cooldown) {
        if (this.hasSuperLiked) {
          if (this.isJustSuperLiked) {
            return 'just-superliked';
          }
          return 'cooldown';
        }
        return 'superlikeable-cooldown';
      }
      if (this.hasSuperLiked) {
        return 'superliked';
      }
      return 'superlikeable';
    },
    isDisabled() {
      return this.state === 'cooldown'
        || this.state === 'superlikeable-cooldown'
        || this.hasBlockingAnimation;
    },
    isShowBadge() {
      return this.isCreator || this.count > 0;
    },
    isShowSuperLikeTick() {
      return this.state === 'just-superliked';
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
      switch (this.state) {
        case 'superlikeable':
        case 'superliked':
          return '#50e3c2';

        case 'unsuperlikeable':
          return '#f7f7f7';

        case 'just-superliked':
        case 'cooldown':
        case 'superlikeable-cooldown':
          return '#fff';

        case 'initial':
        default:
          return '#aaf1e7';
      }
    },
    buttonBgStyle() {
      return {
        fill: this.buttonBgColor,
      };
    },
    cooldownValue() {
      if (this.state === 'cooldown' || this.state === 'superlikeable-cooldown') {
        return this.cooldown;
      }
      return 0;
    },
    cooldownFillColor() {
      switch (this.state) {
        case 'superlikeable':
        case 'superliked':
          return '#28646e';

        case 'just-superliked':
        case 'cooldown':
        case 'superlikeable-cooldown':
          return '#50e3c2';

        case 'unsuperlikeable':
          return '#4a4a4a';

        case 'initial':
        default:
          if (this.isPressing || this.count > 0) {
            return '#28646e';
          }
          return '#50e3c2';
      }
    },
    superLikeIconStroke() {
      switch (this.state) {
        case 'unsuperlikeable':
          return '#9b9b9b';

        case 'cooldown':
        case 'superlikeable-cooldown':
          return '#e6e6e6';

        case 'just-superliked':
          return '#50e3c2';

        default:
          return '#28646e';
      }
    },
    superLikeIconFill() {
      switch (this.state) {
        case 'unsuperlikeable':
        case 'cooldown':
        case 'superlikeable-cooldown':
          return '#50e3c200';

        default:
          return '#50e3c2';
      }
    },
  },
  methods: {
    onClick() {
      if (
        ![
          'unsuperlikeable',
          'cooldown',
          'just-superliked',
          'superlikeable-cooldown',
        ].includes(this.state)
      ) {
        this.startClapBitsAnimation();
      }
      this.$emit('click');
    },
    onClickDisabledButton() {
      this.$emit('click-disabled');
    },
    onCooldownEnd() {
      this.$emit('cooldown-end');
    },
    startClapBitsAnimation() {
      this.clapBits.push(Date.now());
    },
    finishClapBitsAnimation(id) {
      const index = this.clapBits.indexOf(id);
      if (index !== -1) {
        this.clapBits.splice(index, 1);
      }
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
      if (this.state === 'initial') {
        TweenMax.set(el, { opacity: 0 });
      } else {
        TweenMax.set(el, { y: 50 });
      }
    },
    buttonIconEnter(el, done) {
      if (this.state === 'initial') {
        TweenMax.fromTo(el, 0.5, {
          scale: 0,
          transformOrigin: '50% 50%',
          onComplete: done,
        }, {
          scale: 1,
          opacity: 1,
        });
      } else {
        this.hasBlockingAnimation = true;
        const tl = new TimelineMax({ onComplete: done });
        tl.to(el, 0.5, {
          y: 0,
          onComplete: () => {
            this.hasBlockingAnimation = false;
          },
        });
        this.$refs.cooldown.animateTrack(tl);
      }
    },
    buttonIconleave(el, done) {
      TweenMax.to(el, 0.5, {
        scale: 0,
        opacity: 0,
        transformOrigin: '50% 50%',
        onComplete: done,
      });
    },
    starIconEnter(el, done) {
      if (this.state === 'just-superliked') {
        const [star, tick] = el.children;
        TweenMax.set(tick, { opacity: 0 });
        const tl = new TimelineMax({
          onComplete: done,
        });
        tl.from(el, 0.7, {
          scale: 0.4,
          y: 50,
          transformOrigin: '50% 50%',
        });
        tl.fromTo(star, 0.5, {
          fill: '#50e3c2',
          strokeWidth: 0,
        }, {
          scale: 1.2,
          transformOrigin: '50% 50%',
          onComplete: () => {
            this.isShowStarBits = true;
          },
        }, 0);
        tl.to(tick, 0.2, { opacity: 1 });
        this.$refs.cooldown.animateTrack(tl);
      } else {
        TweenMax.from(el, 0.5, {
          scaleX: 0.7,
          scaleY: 1.5,
          y: 100,
          opacity: 0,
          transformOrigin: '50% 50%',
          onComplete: done,
        });
      }
    },
    starIconleave(el, done) {
      if (this.state === 'cooldown') {
        TweenMax.to(el, 0.5, {
          scaleX: 0.7,
          scaleY: 1.5,
          y: -100,
          opacity: 0,
          transformOrigin: '50% 50%',
          onComplete: done,
        });
      } else {
        const [, tick] = el.children;
        const tl = new TimelineMax({
          onComplete: done,
        });
        tl.to(el, 0.2, {
          opacity: 0,
          scale: 2,
          transformOrigin: '50% 50%',
        });
        tl.to(tick, 0.2, {
          opacity: 0,
        });
      }
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
