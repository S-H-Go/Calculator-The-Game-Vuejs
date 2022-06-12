<template>
  <button @click="sum" class="function-button color-button-orange">SUM</button>
</template>

<script>
export default {
  name: "SumButton",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    sum: function () {
      if (this.step > 0 && this.currentNum != 0) {
        const numStr = this.currentNum.toString().replaceAll("-", "");
        let sum = 0;
        for (let i of numStr) {
          sum += Number(i);
        }
        if (this.currentNum.toString().includes("-")) {
          sum *= -1;
        }
        this.$emit("changeCurrentNum", sum);
      }
    },
  },
};
</script>

<style>
</style>