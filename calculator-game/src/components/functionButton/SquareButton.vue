<template>
  <button @click="square" class="button color-button-orange">
    x²
  </button>
</template>

<script>
import { CHANGE_CURRENT_NUM } from '@/store/mutation-types'

export default {
  name: "SquareButton",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    square() {
      if (this.currentNum == 0 || this.step == 0) {
        return;
      }
      this.$store.commit(CHANGE_CURRENT_NUM, Math.pow(Number(this.currentNum), 2));
    },
  },
};
</script>

<style>
</style>