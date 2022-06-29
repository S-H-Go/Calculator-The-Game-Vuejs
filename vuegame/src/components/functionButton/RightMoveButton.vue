<template>
  <button @click="rightMove" class="button color-button-orange">
    &lt;&lt;
  </button>
</template>

<script>
import { CHANGE_CURRENT_NUM } from '@/store/mutation-types'

export default {
  name: "RightMoveButton",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    rightMove() {
      let numStr = this.currentNum.toString();
      if (this.step > 0 && this.currentNum != 0) {
        //如果是负数，并且长度为2时，更改为0
        if (numStr.includes("-") && numStr.length == 2) {
          this.$store.commit(CHANGE_CURRENT_NUM, 0);
          return;
        }
        //不是负数如果只剩一位数
        if (numStr.length == 1) {
          this.$store.commit(CHANGE_CURRENT_NUM, 0);
          return;
        }
        this.$store.commit(
          CHANGE_CURRENT_NUM,
          Number(numStr.slice(0, numStr.length - 1))
        );
      }
    },
  },
};
</script>

<style>
</style>