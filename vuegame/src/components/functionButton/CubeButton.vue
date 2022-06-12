<template>
  <button @click="cube" class="function-button color-button-orange">x³</button>
</template>

<script>
export default {
  name: "CubeButton",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    cube: function () {
      this.$emit("changeCurrentNum", Math.pow(this.currentNum, 3));
    },
  },
};
</script>

<style>
</style>