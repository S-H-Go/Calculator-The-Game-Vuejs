<template>
  <button @click="mirror" class="button color-button-orange">
    Mirror
  </button>
</template>

<script>
import { CHANGE_CURRENT_NUM } from '@/store/mutation-types'

export default {
  name: "MirrorButton",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    mirror() {
      let numArray = this.currentNum.toString().replaceAll("-", "").split("");
      for (let i = numArray.length - 1; i >= 0; i--) {
        numArray.push(numArray[i]);
      }
      if (this.currentNum.toString().includes("-")) {
        this.$store.commit(
          CHANGE_CURRENT_NUM,
          Number("-" + numArray.join().replaceAll(",", ""))
        );
      } else {
        this.$store.commit(
          CHANGE_CURRENT_NUM,
          Number(numArray.join().replaceAll(",", ""))
        );
      }
    },
  },
};
</script>

<style>
</style>