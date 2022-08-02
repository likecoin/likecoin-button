<template>
  <g>
    <!-- Cooldown Track -->
    <circle
      :r="radius"
      :style="trackStyle"
      :cx="center"
      :cy="center"
    />
    <!-- Cooldown Fill -->
    <circle
      ref="fill"
      :r="radius"
      :style="fillStyle"
      :cx="center"
      :cy="center"
    />
  </g>
</template>

<script>
import {
  Linear,
  Power2,
  Power4,
  TimelineMax,
} from 'gsap/all';

export default {
  name: 'like-button-v2-cooldown',
  props: {
    value: {
      type: Number,
      default: 0.0,
    },
    endTime: {
      type: Number,
      default: 0,
    },
    radius: {
      type: Number,
      required: true,
    },
    center: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: 'black',
    },
    isBold: {
      type: Boolean,
      default: false,
    },
    strokeWidth: {
      type: Number,
      default: 4,
    },
  },
  data() {
    const fillLength = this.calculateFillLength(this.value);
    return {
      fillLength: fillLength > 0
        ? Math.max(this.getMinAnimatedFillLength(), fillLength)
        : 0
      ,
    };
  },
  computed: {
    diameter() {
      return this.calculateDiameter();
    },
    strokeStyle() {
      return {
        fill: 'none',
        strokeLinecap: 'round',
        strokeWidth: `${this.isBold ? this.strokeWidth * 3 / 2 : this.strokeWidth}px`,
        transition: 'stroke 0.25s ease, stroke-width 0.25s ease, fill 0.25s ease',
      };
    },
    trackStyle() {
      return {
        ...this.strokeStyle,
        stroke: '#e6e6e6',
      };
    },
    fillStyle() {
      return {
        ...this.strokeStyle,
        transform: 'rotate(-90deg)',
        transformOrigin: 'center',
        stroke: this.color,
        strokeDasharray: this.diameter,
        strokeDashoffset: this.fillLength,
      };
    },
    minAnimatedFillLength() {
      return this.getMinAnimatedFillLength();
    },
  },
  watch: {
    value(newValue) {
      this.isUpdatingFillLength = true;
      const newFillLength = this.calculateFillLength(newValue);
      if (this.tween) {
        this.tween.kill();
      }
      this.tween = new TimelineMax({
        onComplete: () => {
          this.fillLength = newFillLength;
          this.isUpdatingFillLength = false;
          this.startCountdownAnimation();
        },
      });
      const progress = Math.abs(newFillLength - this.fillLength) / this.diameter;
      this.tween.to(this.$refs.fill, 3 * progress, {
        strokeDashoffset: newFillLength,
        ease: Power2.easeInOut,
      });
    },
    endTime() {
      if (!this.isUpdatingFillLength) {
        this.startCountdownAnimation();
      }
    },
  },
  mounted() {
    this.startCountdownAnimation();
  },
  beforeDestroy() {
    if (this.tween) {
      this.tween.kill();
    }
  },
  methods: {
    onEnd() {
      this.$emit('end');
    },
    getMinAnimatedFillLength() {
      return this.strokeWidth * 1.5;
    },
    calculateDiameter() {
      return Math.PI * (this.radius * 2);
    },
    calculateFillLength(value) {
      // NOTE: `this.diameter` is undefined in data()
      const diameter = this.diameter || this.calculateDiameter();
      return Math.min(1, Math.max(0, value)) * diameter;
    },
    animateTrack(parentTl) {
      if (this.tween) {
        this.tween.kill();
      }
      this.tween = new TimelineMax({
        onComplete: () => {
          this.startCountdownAnimation();
        },
      });
      this.tween.fromTo(this.$refs.fill, 1, {
        strokeDashoffset: this.diameter,
      }, {
        strokeDashoffset: this.fillLength,
      });
      this.tween.to(this.$refs.fill, 1, {
        strokeDashoffset: this.calculateFillLength(this.value),
      });
      parentTl.add(this.tween, 0);
    },
    startCountdownAnimation() {
      const secondsLeft = (this.endTime - Date.now()) / 1000;
      if (secondsLeft > 0) {
        if (this.tween) {
          this.tween.kill();
        }
        this.tween = new TimelineMax({
          onComplete: () => {
            this.fillLength = 0;
            this.onEnd();
          },
        });
        // The countdown animation consists of 2 parts
        const remainingDuration = Math.max(
          0.2,
          secondsLeft * (
            1 - Math.abs((this.fillLength - this.minAnimatedFillLength) / this.fillLength)
          ),
        );

        // 1) A linear animation for displaying countdown
        this.tween.to(this.$refs.fill, secondsLeft - remainingDuration, {
          strokeDashoffset: this.minAnimatedFillLength,
          ease: Linear.easeNone,
        });
        // 2) Emphsize the ending of the animation by a short pause
        const emphsizeDuration = 0.25;
        this.tween.to(this.$refs.fill, emphsizeDuration, {
          strokeDashoffset: 0,
          ease: Power4.easeInOut,
        }, `+=${Math.max(remainingDuration - emphsizeDuration, emphsizeDuration)}`);
      }
    },
  },
};
</script>
