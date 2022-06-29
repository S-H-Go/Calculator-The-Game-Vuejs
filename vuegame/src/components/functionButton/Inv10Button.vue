<template>
  <button @click="inv10" class="button color-button-orange">
    Inv10
  </button>
</template>

<script>
import { CHANGE_CURRENT_NUM } from "@/store/mutation-types";
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
          if (x != 0) {
            resultArray.push(Number(10 - x));
          } else {
            resultArray.push(0);
          }
        }
        this.$store.commit(
          CHANGE_CURRENT_NUM,
          Number(resultArray.join().replaceAll(",", ""))
        );
      }
    },
  },
};
</script>

<style>
</style>