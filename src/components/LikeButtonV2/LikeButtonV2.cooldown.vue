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
      :r="radius"
      :style="fillStyle"
      :cx="center"
      :cy="center"
      ref="fill"
    />
  </g>
</template>

<script>
import {
  Linear,
  Power2,
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
  },
  data() {
    return {
      fillLength: this.calculateFillLength(this.value),
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
        strokeWidth: `${this.isBold ? 6 : 4}px`,
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
      this.tween.to(this.$refs.fill, 5 * progress, {
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
      this.tween = new TimelineMax();
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
        this.tween = new TimelineMax({ onComplete: this.onEnd });
        this.tween.to(this.$refs.fill, secondsLeft, {
          strokeDashoffset: 0,
          ease: Linear.easeNone,
        });
      }
    },
  },
};
</script>
