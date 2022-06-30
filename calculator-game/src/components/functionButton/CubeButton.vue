<template>
  <button @click="cube" class="button color-button-orange">x³</button>
</template>

<script>
import { CHANGE_CURRENT_NUM } from '@/store/mutation-types'

export default {
  name: "CubeButton",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    cube() {
      this.$store.commit(CHANGE_CURRENT_NUM, Math.pow(this.currentNum, 3));
    },
  },
};
</script>

<style>
</style>