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
export default {
  name: 'like-button-v2-cooldown',
  props: {
    value: {
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
  computed: {
    diameter() {
      return Math.PI * (this.radius * 2);
    },
    fillLength() {
      const value = Math.min(100, Math.max(0, this.value));
      return (value / 100) * this.diameter;
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
  methods: {
    animateTrack(tl) {
      tl.fromTo(this.$refs.fill, 1, {
        strokeDashoffset: this.diameter,
      }, {
        strokeDashoffset: this.fillLength,
      }, 0);
    },
  },
};
</script>
