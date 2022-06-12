<template>
  <button @click="mirror" class="function-button color-button-orange">
    Mirror
  </button>
</template>

<script>
export default {
  name: "MirrorButton",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    mirror: function () {
      let numArray = this.currentNum.toString().replaceAll("-", "").split("");
      for (let i = numArray.length - 1; i >= 0; i--) {
        numArray.push(numArray[i]);
      }
      if (this.currentNum.toString().includes("-")) {
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
    },
  },
};
</script>

<style>
</style>