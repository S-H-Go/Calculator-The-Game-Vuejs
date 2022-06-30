<template>
  <button @click="shiftLeft" class="button color-button-orange">
    Shift&lt;
  </button>
</template>

<script>
import { CHANGE_CURRENT_NUM } from '@/store/mutation-types'

export default {
  name: "ShiftLeftButton",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    shiftLeft() {
      if (this.step > 0 && this.currentNum != 0) {
        const numStr = this.currentNum.toString().replaceAll("-", "");
        let numArray = numStr.split("");
        numArray.push(numArray.shift());
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