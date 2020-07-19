<!-- eslint-disable max-len -->
<template>
  <g
    ref="root"
    style="fill: #50e3c2;fill-rule: evenodd"
  >
    <g
      v-for="i in 5"
      :key="i"
      :style="{
        transform: `rotateZ(${i * 72}deg)`,
        transformOrigin: 'center',
      }"
    >
      <path
        :style="{
          opacity: 0,
        }"
        ref="bits"
        d="M78,74.8c.26,0,.35.2.42.36a54.56,54.56,0,0,1,1.76,5.18.52.52,0,0,1-.35.69,9.93,9.93,0,0,1-3.66,0,.52.52,0,0,1-.35-.69c.18-.78,1.39-4.38,1.76-5.18.07-.16.16-.36.42-.36Z"
      />
    </g>
  </g>
</template>
<!-- eslint-enable max-len -->

<script>
import { TimelineMax } from 'gsap/all';

export default {
  name: 'likecoin-button-v2-star-bits',
  mounted() {
    const tl = new TimelineMax({
      onComplete: this.onFinishAnimation,
    });
    tl
      // Reset bits' position
      .set(this.$refs.bits, {
        y: 0,
        opacity: 0,
        scale: 0,
        transformOrigin: '50% 50%',
      })
      // Animate bits explosion
      .to(this.$refs.bits, 0.5, {
        y: 25,
        scale: 1,
        opacity: 1,
        transformOrigin: '50% 50%',
      })
      // Fade away bits
      .to(this.$refs.bits, 0.5, { opacity: 0 });
  },
  methods: {
    onFinishAnimation() {
      this.$emit('end');
    },
  },
};
</script>
