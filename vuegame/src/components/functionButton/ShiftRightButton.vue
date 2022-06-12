<template>
  <button @click="shiftRight" class="function-button color-button-orange">
    Shift&gt;
  </button>
</template>

<script>
export default {
  name: "ShiftRightButton",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    shiftRight: function () {
      if (this.step > 0 && this.currentNum != 0) {
        const numStr = this.currentNum.toString().replaceAll("-", "");
        let numArray = numStr.split("");
        numArray.unshift(numArray.pop());
        if (this.currentNum.toString().includes("-")) {
          //如果是负数
          this.$emit(
            "changeCurrentNum",
            Number("-" + numArray.join().replaceAll(",", ""))
          );
        } else {
          this.$emit(
            "changeCurrentNum",
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