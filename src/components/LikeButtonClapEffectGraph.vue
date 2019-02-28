<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    class="like-button-clap-effect-graph"
    role="presentation"
  >
    <defs>
      <path
        :d="$options.triangle.path"
        id="clap-effect-path"
      />
    </defs>
    <g ref="graph">
      <g
        v-for="i in $options.triangle.count"
        :key="i"
        :transform="`rotate(${i * 360 / $options.triangle.count})`"
        style="transform-origin: 50% 50%"
      >
        <use xlink:href="#clap-effect-path" />
      </g>
    </g>
  </svg>
</template>

<script>
import { TweenMax, TimelineMax } from 'gsap';

function getRandomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

export default {
  name: 'like-button-clap-effect-graph',
  triangle: {
    path: 'M50,39c-0.4,0-0.5,0.3-0.7,0.6c-0.6,1.4-2.6,7.5-2.9,8.8c-0.1,0.7,0.1,1,0.5,1.2c0.5,0.3,1.5,0.3,3,0.3c1.5,0,2.4-0.1,3-0.3c0.5-0.2,0.8-0.5,0.5-1.2c-0.3-1.4-2.3-7.5-2.9-8.8C50.5,39.4,50.4,39,50,39L50,39z',
    count: 12,
    yMax: 50,
    yMin: 45,
    scaleMax: 1,
    scaleMin: 0.5,
  },
  mounted() {
    this.animate();
  },
  methods: {
    animate() {
      const { graph } = this.$refs;
      if (!graph) return;

      const allTriangles = [...graph.children].map(g => g.children);
      if (allTriangles.length === 0) return;

      const tl = new TimelineMax({ repeat: 0 });
      tl
        // Reset rotation of the graph
        .to(graph, 0, {
          rotationZ: Math.random() * 360 + 1,
          transformOrigin: '50% 50%',
        })
        // Reset triangles' position
        .to(allTriangles, 0, { opacity: 1, scale: 0 })
        .add('beforeExplode');

      const {
        yMax, yMin, scaleMax, scaleMin,
      } = this.$options.triangle;
      allTriangles.forEach((triangle) => {
        // Animate triangle explosion
        tl.add(
          TweenMax.to(triangle, 0.25, {
            y: getRandomInRange(yMin, yMax),
            scale: getRandomInRange(scaleMin, scaleMax),
          }),
          'beforeExplode',
        );
      });

      tl
        // Fade away triangles
        .to(allTriangles, 0.25, { opacity: 0 })
        .eventCallback('onComplete', () => {
          this.$emit('end');
        });
    },
  },
};
</script>
