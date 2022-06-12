<template>
  <button @click="square" class="function-button color-button-orange">
    x²
  </button>
</template>

<script>
export default {
  name: "SquareButton",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    square: function () {
      if (this.currentNum == 0 || this.step == 0) {
        return;
      }
      this.$emit("changeCurrentNum", Math.pow(Number(this.currentNum), 2));
    },
  },
};
</script>

<style>
</style>