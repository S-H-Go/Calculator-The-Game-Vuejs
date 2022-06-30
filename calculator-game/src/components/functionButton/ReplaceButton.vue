<template>
  <button @click="replace" class="button color-button-orange">
    {{ num1 }}=&gt;{{ num2 }}
  </button>
</template>

<script>
import { CHANGE_CURRENT_NUM } from '@/store/mutation-types'

export default {
  name: "ReplaceButton",
  props: {
    currentNum: Number,
    step: Number,
    num1: Number,
    num2: Number,
  },
  methods: {
    replace() {
      let numStr = this.currentNum.toString();
      if (this.step > 0) {
        let resultStr = numStr.replaceAll(
          this.num1.toString(),
          this.num2.toString()
        );
        this.$store.commit(CHANGE_CURRENT_NUM, Number(resultStr));
      }
    },
  },
};
</script>

<style>
</style>