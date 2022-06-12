<template>
  <button @click="pposite" class="function-button color-button-orange">
    +/-
  </button>
</template>

<script>
export default {
  name: "PpositeButton",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    pposite: function () {
      if (this.step > 0 && this.currentNum != 0) {
        this.$emit("changeCurrentNum", -1 * this.currentNum);
      }
    },
  },
};
</script>

<style>
</style>