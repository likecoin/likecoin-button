<!-- eslint-disable max-len -->
<template>
  <g
    ref="root"
    style="fill: #50e3c2;fill-rule: evenodd"
  >
    <g
      v-for="i in 12"
      :key="i"
      :style="{
        transform: `rotateZ(${i * 30 - 15}deg)`,
        transformOrigin: 'center',
      }"
    >
      <path
        ref="bits"
        :style="{
          opacity: 0,
        }"
        d="M78,87c.7,0,1-.55,1.13-1,1-2.27,4.29-12.35,4.79-14.58a1.5,1.5,0,0,0-.92-2A15.23,15.23,0,0,0,78,69c-2.5,0-4,.07-5,.53-.77.11-1.21.72-1,1.87.48,2.17,3.79,12.28,4.81,14.6.19.35.46,1,1.16,1Z"
      />
    </g>
  </g>
</template>
<!-- eslint-enable max-len -->

<script>
import { TimelineMax } from 'gsap/all';

export default {
  name: 'likecoin-button-v2-clap-bits',
  props: {
    id: {
      type: String,
      required: true,
    },
    explosionRange: {
      type: Number,
      required: true,
    },
    explosionSize: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    const tl = new TimelineMax({
      onComplete: this.onFinishAnimation,
    });
    tl
      // Reset rotation of the graph
      .set(this.$refs.root, {
        rotationZ: Math.random() * 360 + 1,
        transformOrigin: '50% 50%',
      })
      // Reset bits' position
      .set(this.$refs.bits, {
        y: 0,
        opacity: 0,
        scale: 0,
        transformOrigin: '50% 50%',
      })
      // Animate bits explosion
      .to(this.$refs.bits, 0.5, {
        y: this.explosionRange / -1 * 66,
        scale: this.explosionSize,
        opacity: 1,
        transformOrigin: '50% 50%',
      })
      // Fade away clap bits
      .to(this.$refs.bits, 0.25, { opacity: 0 });
  },
  methods: {
    onFinishAnimation() {
      this.$emit('end', this.id);
    },
  },
};
</script>
