<template>
  <button @click="shiftLeft" class="function-button color-button-orange">
    Shift&lt;
  </button>
</template>

<script>
export default {
  name: "ShiftLeftButton",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    shiftLeft: function () {
      if (this.step > 0 && this.currentNum != 0) {
        const numStr = this.currentNum.toString().replaceAll("-", "");
        let numArray = numStr.split("");
        numArray.push(numArray.shift());
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