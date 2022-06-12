<template>
  <button @click="replace" class="function-button color-button-orange">
    {{ num1 }}=&gt;{{ num2 }}
  </button>
</template>

<script>
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
      let resultStr = numStr.replaceAll(
        this.num1.toString(),
        this.num2.toString()
      );
      this.$emit("changeCurrentNum", Number(resultStr));
    },
  },
};
</script>

<style>
</style>