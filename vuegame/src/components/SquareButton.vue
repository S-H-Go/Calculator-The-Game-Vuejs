<template><button @click="square">x²</button></template>

<script>
export default {
  name: "SquareButton",
  props: {
    info: Object,
  },
  methods: {
    square: function () {
      if (this.info.currentNum == 0) {
        return;
      }
      this.$emit(
        "changeCurrentNum",
        Number(this.info.currentNum) * Number(this.info.currentNum)
      );
    },
  },
};
</script>

<style>
</style>