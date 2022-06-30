<template>
  <button @click="each" class="button color-button-orange">
    [{{ operation }}]{{ num1 }}
  </button>
</template>

<script>
import { EACH_BUTTON } from "@/store/mutation-types"
export default {
  name: "EachButton",
  props: {
    currentNum: Number,
    step: Number,
    operation: String,
    num1: Number,
  },
  methods: {
    each() {
      if (this.step > 0) {
        this.$store.commit(EACH_BUTTON, [this.operation, this.num1]);
      }
    },
  },
};
</script>

<style>
</style>