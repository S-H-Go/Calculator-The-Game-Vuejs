<template>
  <button
    @click="elementaryArithmetic"
    class="function-button color-button-grey"
  >
    {{ operation }}{{ num1 }}
  </button>
</template>

<script>
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
            this.$emit("changeCurrentNum", this.currentNum + this.num1);
            break;
          }
          case "-": {
            this.$emit("changeCurrentNum", this.currentNum - this.num1);
            break;
          }
          case "x": {
            if(this.currentNum!=0){
            this.$emit("changeCurrentNum", this.currentNum * this.num1);
            }
            break;
          }
          case "/": {
            if(this.currentNum!=0){
            this.$emit("changeCurrentNum", this.currentNum / this.num1);
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