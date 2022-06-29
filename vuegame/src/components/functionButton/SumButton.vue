<template>
  <button @click="sum" class="button color-button-orange">SUM</button>
</template>

<script>
import { CHANGE_CURRENT_NUM } from '@/store/mutation-types';

export default {
  name: "SumButton",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    sum() {
      if (this.step > 0 && this.currentNum != 0) {
        //去除负号后的当前数字的字符串
        const numStr = this.currentNum.toString().replaceAll("-", "");
        let sum = 0;
        for (let i of numStr) {
          sum += Number(i);
        }
        if (this.currentNum.toString().includes("-")) {
          sum *= -1;
        }
        this.$store.commit(CHANGE_CURRENT_NUM, sum);
      }
    },
  },
};
</script>

<style>
</style>