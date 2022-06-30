<template>
  <button @click="pposite" class="button color-button-orange">
    +/-
  </button>
</template>

<script>
import { CHANGE_CURRENT_NUM } from '@/store/mutation-types'

export default {
  name: "PpositeButton",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    pposite() {
      if (this.step > 0 && this.currentNum != 0) {
        this.$store.commit(CHANGE_CURRENT_NUM, -1 * this.currentNum);
      }
    },
  },
};
</script>

<style>
</style>