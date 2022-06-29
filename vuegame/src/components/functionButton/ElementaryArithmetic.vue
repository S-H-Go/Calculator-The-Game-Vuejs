<template>
  <button @click="elementaryArithmetic" class="button color-button-grey">
    {{ operation }}{{ num1 }}
  </button>
</template>

<script>
//四则运算按钮
import { CHANGE_CURRENT_NUM } from '@/store/mutation-types'

export default {
  name: "ElementaryArithmetic",
  props: {
    currentNum: Number,
    step: Number,
    operation: String,
    num1: Number,
  },
  methods: {
    elementaryArithmetic() {
      if (this.step > 0) {
        switch (this.operation) {
          case "+": {
            this.$store.commit(CHANGE_CURRENT_NUM, this.currentNum + this.num1);
            break;
          }
          case "-": {
            this.$store.commit(CHANGE_CURRENT_NUM, this.currentNum - this.num1);
            break;
          }
          case "x": {
            if (this.currentNum != 0) {
              this.$store.commit(CHANGE_CURRENT_NUM, this.currentNum * this.num1);
            }
            break;
          }
          case "/": {
            if (this.currentNum != 0 && this.num1 != 0) {
              this.$store.commit(CHANGE_CURRENT_NUM, this.currentNum / this.num1);
            }
            break;
          }
        }
      }
    },
  },
};
</script>

<style>
</style>