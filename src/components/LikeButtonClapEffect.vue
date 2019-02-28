<template>
  <div
    v-if="graphIds.length > 0"
    class="like-button-clap-effect"
  >
    <Graph
      v-for="id in graphIds"
      :key="id"
      @end="removeGraph(id)"
    />
  </div>
</template>

<script>
import Graph from './LikeButtonClapEffectGraph';

export default {
  components: {
    Graph,
  },
  data() {
    return {
      graphIds: [],
    };
  },
  methods: {
    animate() {
      this.graphIds.push(Date.now());
    },
    removeGraph(id) {
      const index = this.graphIds.indexOf(id);
      if (index >= 0) this.graphIds.splice(index, 1);
    },
  },
};
</script>

<style lang="scss">
.like-button-clap-effect {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  .like-button-clap-effect-graph {
    position: inherit;
    top: inherit;
    right: inherit;
    bottom: inherit;
    left: inherit;
  }
}
</style>
