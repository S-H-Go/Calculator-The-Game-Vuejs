<template>
  <button @click="insert" class="function-button color-button-blue hide">
    {{ num1 }}
  </button>
</template>

<script>
export default {
  name: "InsertButton",
  props: {
    currentNum: Number,
    step: Number,
    num1: [Number, String],
  },
  methods: {
    insert() {
      if (this.step > 0) {
        this.$emit(
          "changeCurrentNum",
          Number(this.currentNum.toString() + this.num1)
        );
      }
    },
  },
};
</script>

<style>
</style>