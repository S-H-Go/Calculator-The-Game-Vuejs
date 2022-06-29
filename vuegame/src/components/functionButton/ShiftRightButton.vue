<template>
  <button @click="shiftRight" class="button color-button-orange">
    Shift&gt;
  </button>
</template>

<script>
import { CHANGE_CURRENT_NUM } from '@/store/mutation-types'

export default {
  name: "ShiftRightButton",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    shiftRight() {
      if (this.step > 0 && this.currentNum != 0) {
        const numStr = this.currentNum.toString().replaceAll("-", "");
        let numArray = numStr.split("");
        numArray.unshift(numArray.pop());
        if (this.currentNum.toString().includes("-")) {
          //如果是负数
          this.$store.commit(
            CHANGE_CURRENT_NUM,
            Number("-" + numArray.join().replaceAll(",", ""))
          );
        } else {
          this.$store.commit(
            CHANGE_CURRENT_NUM,
            Number(numArray.join().replaceAll(",", ""))
          );
        }
      }
    },
  },
};
</script>

<style>
</style>