<template>
  <button @click="insert" class="button color-button-blue hide">
    {{ num1 }}
  </button>
</template>

<script>
import { CHANGE_CURRENT_NUM } from '@/store/mutation-types';
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
        this.$store.commit(CHANGE_CURRENT_NUM, Number(this.currentNum.toString() + this.num1));
      }
    },
  },
};
</script>

<style>
</style>