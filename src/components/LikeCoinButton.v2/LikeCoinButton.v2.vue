<!-- eslint-disable max-len -->
<template>
  <button
    :style="{
      border: 'none',
      background: 'none',
      outline: 'none',
      userSelect: 'none',
    }"
    :disabled="state === 'cooldown'"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
    @mousedown="onPressDown"
    @mouseup="onPressUp"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @click="onClick"
  >
    <svg
      :style="{
        margin: '-40px',
        pointerEvents: 'none',
      }"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 156 156"
      width="156"
    >
      <defs>
        <clipPath id="button-mask">
          <path
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
      <g
        :style="{
          clipPath: 'url(#button-mask)',
          pointerEvents: 'all',
        }"
      >
        <g :style="buttonStyle">
          <!-- Button Bg -->
          <circle
            :r="radius"
            :style="buttonBgStyle"
            cx="78"
            cy="78"
          />
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
              <g
                v-if="state === 'superlikeable' || state === 'cooldown'"
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
                        fill: 'none',
                        stroke: superLikeIconColor,
                        strokeWidth: '3px',
                      }"
                      d="M80,65.38l2.62,5.3a2.27,2.27,0,0,0,1.69,1.23l5.85.85a2.25,2.25,0,0,1,1.25,3.84l-4.23,4.12a2.24,2.24,0,0,0-.65,2l1,5.83a2.25,2.25,0,0,1-3.27,2.37L79,88.16a2.27,2.27,0,0,0-2.09,0l-5.23,2.75a2.25,2.25,0,0,1-3.27-2.37l1-5.83a2.24,2.24,0,0,0-.65-2L64.51,76.6a2.25,2.25,0,0,1,1.25-3.84l5.85-.85a2.27,2.27,0,0,0,1.69-1.23l2.62-5.3A2.25,2.25,0,0,1,80,65.38Z"
                    />
                    <!-- Button Star Trail -->
                    <g
                      :style="{
                        fill: 'none',
                        stroke: superLikeIconColor,
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
                    <!-- Tick -->
                    <polyline
                      points="73.38 80.35 76.68 83.18 82.8 75.76"
                      style="opacity: 0;fill: none;stroke: #28646e;stroke-linecap: round;stroke-linejoin: round;stroke-width: 3px;fill-rule: evenodd"
                    />
                  </g>
                </transition>
              </g>
              <!-- Button Clap -->
              <g
                v-else
                key="clap"
              >
                <path
                  d="M75.1,69.7a1.09,1.09,0,0,1-.9-.4,1.24,1.24,0,0,1,.1-1.7,25.87,25.87,0,0,0,5.2-5.9,4.41,4.41,0,0,1,4.3-2.4,1.22,1.22,0,1,1-.4,2.4,2.11,2.11,0,0,0-1.9,1.2,29.54,29.54,0,0,1-5.7,6.6,1.45,1.45,0,0,1-.7.2M54.6,90.1a1.09,1.09,0,0,1-.9-.4,1.16,1.16,0,0,1,.2-1.7,29.17,29.17,0,0,1,4.5-3,1.19,1.19,0,1,1,1.1,2.1,35.24,35.24,0,0,0-4,2.7,1.9,1.9,0,0,1-.9.3M85.2,78.7c.5.4,1,.3,1.6-.2a45,45,0,0,0,8.5-11.3,1.12,1.12,0,0,1,1.4-.7c.7.3.7,1.4.1,2.7a44,44,0,0,1-8.3,11.6,1,1,0,0,0,0,1.4c.4.4,1,.3,1.6-.3a48.69,48.69,0,0,0,5.2-6,1.13,1.13,0,0,1,1.2-.6c.6.1.7.7.5,1.3-.3,1.1-3.4,5.1-4.6,6.4-3.3,3.7-6.6,5.7-13,8.9-2.2,1.1-3.9,2.2-4.9,3.9-.9,1.5-1.2,2-1.3,2.2a1.42,1.42,0,0,0,.7,2,1.27,1.27,0,0,0,.6.1,1.51,1.51,0,0,0,1.4-.9l1.1-2a8.74,8.74,0,0,1,3.7-3.3,37.77,37.77,0,0,0,12.7-8.8A42.16,42.16,0,0,0,98,78.8c1.8-3,.8-5.5-.8-5.9a.19.19,0,0,1-.1-.3,16,16,0,0,0,2-4.7c.3-1.5-.1-3.4-2.2-3.9-.1,0-.2-.1-.2-.3.1-.5.3-1.1.4-1.5a3.38,3.38,0,0,0-2.4-4.1,3.7,3.7,0,0,0-2.9.6.3.3,0,0,1-.4,0,2,2,0,0,0-1.6-.7,3.69,3.69,0,0,0-3.6,2.4,24.75,24.75,0,0,1-4.7,6.7,51.91,51.91,0,0,1-9,7.6c-.4.3-1,.2-.9-.3.1-.9,1.1-6.8,1.2-8.6.3-2.8-1.3-4.1-3-4.4-1.4-.2-3.6.2-4.8,3.4a82.33,82.33,0,0,0-3.4,10,29.52,29.52,0,0,0-.2,12.3,1.08,1.08,0,0,1-.2.8c-.9,1.5-2.3,3.6-3.1,5.3a1.43,1.43,0,0,0,.6,1.9,1.85,1.85,0,0,0,.7.2,1.51,1.51,0,0,0,1.4-.9c.5-1,1.4-2.8,1.8-3.5a20.83,20.83,0,0,0,1.2-2.7,3.71,3.71,0,0,0,0-2.4,23.82,23.82,0,0,1,.2-9.9,96.1,96.1,0,0,1,3.6-11.1c.4-.9.9-1.2,1.4-1.1s1.5.3,1.2,2.1c-.5,3.3-1.2,7.4-1.4,8.8-.1.7-.2,2.3,1,3,1,.6,2.1.3,3.3-.5a59.55,59.55,0,0,0,10.3-8.7,21.65,21.65,0,0,0,4.8-7.3,1.4,1.4,0,0,1,1.6-.7c.3.1.7.5.4,1.5-.7,2.3-3.5,7.4-8.9,12.3a1,1,0,0,0-.2,1.5,1.07,1.07,0,0,0,1.5,0A35.09,35.09,0,0,0,91.5,64a25.54,25.54,0,0,0,1.1-2.7,1.38,1.38,0,0,1,1.3-1c.6.1,1,.7.8,1.7a23.94,23.94,0,0,1-1.3,3.7A51.66,51.66,0,0,1,85,77.1a1.38,1.38,0,0,0,.2,1.6m-22-16.4a.51.51,0,0,0,.1-.5c-.3-.8-1.8-4.3-2.1-5-.2-.3-.4-.4-.7-.3a6.29,6.29,0,0,0-1.5,1,6,6,0,0,0-1.2,1.3.53.53,0,0,0,.2.7,53,53,0,0,0,4.7,2.8.33.33,0,0,0,.5,0Zm-1.3,2.3c0-.2-.3-.3-.4-.3-.9-.2-4.6-.7-5.4-.8-.4,0-.6.2-.6.4a6.05,6.05,0,0,0,.1,1.8,5.85,5.85,0,0,0,.5,1.7.48.48,0,0,0,.7.2c.7-.3,4.1-2.1,4.8-2.6.1,0,.3-.1.3-.4ZM90.1,93c-.2,0-.3.2-.4.4-.3.8-1.2,4.5-1.4,5.3a.53.53,0,0,0,.4.7,8.16,8.16,0,0,0,1.8.1,5.94,5.94,0,0,0,1.8-.3c.3-.1.4-.3.3-.7a31.15,31.15,0,0,0-2.1-5c0-.3-.1-.5-.4-.5Zm2.2-1.7a.44.44,0,0,0,.1.5,46.83,46.83,0,0,0,3.8,3.9.52.52,0,0,0,.8,0,5.4,5.4,0,0,0,1-1.5,12.83,12.83,0,0,0,.7-1.6c0-.3-.1-.5-.5-.6-.8-.2-4.5-.8-5.4-.9-.2,0-.4,0-.5.2Z"
                  style="fill: #28646e"
                />
              </g>
            </transition>
          </g>
          <!-- Button Rim -->
          <circle
            :style="rimStyle"
            :r="radius"
            ref="rim"
            cx="78"
            cy="78"
          />
        </g>
      </g>
      <!-- Badge -->
      <g>
        <circle
          :style="{
            fill: badgeBgColor,
          }"
          ref="badgeBg"
          cx="120"
          cy="110"
          r="18"
        />
        <transition
          @before-enter="badgeBeforeEnter"
          @enter="badgeIconEnter"
          @leave="badgeIconLeave"
          :css="false"
          mode="out-in"
        >
          <g
            v-if="state !== 'initial'"
            :style="{
              fill: shareIconColor,
              fillRule: 'evenodd',
            }"
            key="shareIcon"
            ref="shareIcon"
          >
            <path d="M115.13,107.11a2,2,0,1,0-2-2A2,2,0,0,0,115.13,107.11Z" />
            <path d="M113,111.51a1.24,1.24,0,0,1,1.08-1.24,7.23,7.23,0,0,0,6.19-6.19,1.25,1.25,0,0,1,2.48.34,9.75,9.75,0,0,1-8.34,8.33,1.25,1.25,0,0,1-1.4-1.07A1,1,0,0,1,113,111.51Z" />
            <path d="M113,116.8a1.25,1.25,0,0,1,1.15-1.24,12.42,12.42,0,0,0,11.43-11.41,1.26,1.26,0,0,1,1.35-1.15,1.27,1.27,0,0,1,1.15,1.35,14.93,14.93,0,0,1-13.73,13.7,1.25,1.25,0,0,1-1.35-1.14Z" />
          </g>
          <g
            v-else
            key="count"
          >
            <foreignObject
              :x="120 - 18"
              :y="110 - 18"
              :width="18 * 2"
              :height="18 * 2"
            >
              <div
                :style="{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }"
              >
                <span
                  :style="{
                    color: '#28646e',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }"
                >{{ count }}</span>
              </div>
            </foreignObject>
          </g>
        </transition>
      </g>
      <!-- Clap Bits -->
      <ClapBits
        v-for="id in clapBits"
        :key="id"
        :id="id"
        @end="finishClapBitsAnimation"
      />
    </svg>
  </button>
</template>
<!-- eslint-enable max-len -->

<script>
import { TimelineMax, TweenMax } from 'gsap/all';
import ClapBits from './LikeCoinButton.v2.clapBits';
import StarBits from './LikeCoinButton.v2.starBits';

export default {
  name: 'likecoin-button-v2',
  components: {
    ClapBits,
    StarBits,
  },
  props: {
    count: {
      type: Number,
      default: 0,
    },
    cooldown: {
      type: Number,
      default: 0,
    },
    state: {
      type: String,
      default: 'initial',
      validator(value) {
        return ['initial', 'superlikeable', 'cooldown'].indexOf(value) !== -1;
      },
    },
  },
  data() {
    return {
      radius: 38,
      isHovering: false,
      isPressing: false,
      clapBits: [],
      isShowStarBits: false,
    };
  },
  computed: {
    buttonStyle() {
      return {
        transform: `scale(${this.isPressing ? 0.9 : 1})`,
        transition: 'transform 0.25s ease',
        transformOrigin: 'center',
      };
    },
    buttonBgColor() {
      switch (this.state) {
        case 'superlikeable':
          return '#50e3c2';

        case 'cooldown':
          return '#fff';

        case 'initial':
        default:
          return '#aaf1e7';
      }
    },
    buttonBgStyle() {
      return {
        ...this.strokeStyle,
        fill: this.buttonBgColor,
        stroke: '#e6e6e6',
      };
    },
    rimStrokeColor() {
      switch (this.state) {
        case 'superlikeable':
          return '#28646e';

        case 'cooldown':
          return '#50e3c2';

        case 'initial':
        default:
          if (this.isPressing || this.count >= 1) {
            return '#28646e';
          }
          return '#50e3c2';
      }
    },
    rimStyle() {
      return {
        ...this.strokeStyle,
        transform: 'rotate(-90deg)',
        transformOrigin: 'center',
        fill: 'none',
        stroke: this.rimStrokeColor,
        strokeDasharray: this.strokeDashArrayValue,
        strokeDashoffset: this.strokeDashOffsetValue,
      };
    },
    badgeBgColor() {
      switch (this.state) {
        case 'superlikeable':
        case 'cooldown':
          return '#e6e6e6';

        case 'initial':
        default:
          return '#aaf1e7';
      }
    },
    shareIconColor() {
      return '#9b9b9b';
    },
    superLikeIconColor() {
      if (this.state === 'cooldown') {
        return '#e6e6e6';
      }
      return '#28646e';
    },
    strokeStyle() {
      return {
        strokeLinecap: 'round',
        strokeWidth: `${this.isHovering ? 6 : 4}px`,
        transition: 'stroke 0.25s ease, stroke-width 0.25s ease, fill 0.25s ease',
      };
    },
    strokeDashArrayValue() {
      return Math.PI * (this.radius * 2);
    },
    strokeDashOffsetValue() {
      if (this.state === 'cooldown') {
        const cooldown = Math.min(100, Math.max(0, this.cooldown));
        return (cooldown / 100) * this.strokeDashArrayValue;
      }
      return 0;
    },
  },
  methods: {
    onMouseOver() {
      this.isHovering = true;
    },
    onMouseLeave() {
      this.isHovering = false;
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
      this.startClapBitsAnimation();
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
        TweenMax.to(el, 0.5, {
          y: 0,
          onComplete: done,
        });
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
      if (this.state === 'cooldown') {
        const tl = new TimelineMax({ onComplete: done });
        const [star, starTrail, tick] = el.children;
        this.startShareAnimation();
        tl.set(starTrail, { opacity: 0 });
        tl.delay(0.2);
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
        tl.fromTo(tick, 0.2, {
          strokeWidth: 0,
        }, {
          strokeWidth: 3,
          opacity: 1,
        });
        tl.addLabel('end');
        tl.to(starTrail, 1, { opacity: 1 }, 'end+=1');
        tl.to(star, 1, {
          scale: 1,
          stroke: this.superLikeIconColor,
          strokeWidth: 3,
          fill: 'transparent',
        }, 'end+=1');
        tl.to(tick, 1, {
          opacity: 0,
        }, 'end+=1');
        tl.fromTo(this.$refs.rim, 1, {
          strokeDashoffset: this.strokeDashArrayValue,
        }, {
          strokeDashoffset: this.strokeDashOffsetValue,
        }, 0);
      } else {
        done();
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
        TweenMax.to(el, 0.5, {
          opacity: 0,
          onComplete: done,
        });
      }
    },
    startShareAnimation() {
      const tl = new TimelineMax();
      tl.to(this.$refs.badgeBg, 0.5, {
        fill: '#50e3c2',
      });
      tl.to(this.$refs.shareIcon.children, 0.2, {
        fill: '#28646e',
        stagger: 0.1,
      }, 0);
      tl.addLabel('end');
      tl.to(this.$refs.badgeBg, 0.5, {
        fill: this.badgeBgColor,
      }, 'end+=1');
      tl.to(this.$refs.shareIcon.children, 0.5, {
        fill: this.shareIconColor,
      }, 'end+=1');
    },
    badgeBeforeEnter(el) {
      TweenMax.set(el, { opacity: 0 });
    },
    badgeIconEnter(el, onComplete) {
      const fromConfig = {
        scale: 0,
        onComplete,
      };
      if (this.state === 'initial') {
        fromConfig.transformOrigin = '50% 50%';
      }
      const toConfig = {
        opacity: 1,
        scale: 1,
        onComplete,
      };
      TweenMax.fromTo(el, 0.5, fromConfig, toConfig);
    },
    badgeIconLeave(el, onComplete) {
      TweenMax.to(el, 0.5, {
        opacity: 0,
        onComplete,
      });
    },
  },
};
</script>
