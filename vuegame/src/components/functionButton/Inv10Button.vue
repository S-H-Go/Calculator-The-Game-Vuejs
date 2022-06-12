<template>
  <button @click="inv10" class="function-button color-button-orange">
    Inv10
  </button>
</template>

<script>
export default {
  name: "Inv10Button",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    inv10() {
      if (this.step > 0) {
        let numArray = this.currentNum.toString().split("");
        let resultArray = [];
        for (let x of numArray) {
          if(x!=0){
            resultArray.push(Number(10 - x));
          }else{
            resultArray.push(0);
          }
        }
        this.$emit(
          "changeCurrentNum",
          Number(resultArray.join().replaceAll(",", ""))
        );
      }
    },
  },
};
</script>

<style>
</style>