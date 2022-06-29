<template>
  <button @click="reverse" class="button color-button-orange">Reverse</button>
</template>

<script>
import { CHANGE_CURRENT_NUM } from '@/store/mutation-types'

export default {
  name: "ReverseButton",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    reverse() {
      if (this.step > 0 && this.currentNum != 0) {
        let numStr = this.currentNum.toString();
        if (numStr.includes("-")) {
          this.$store.commit(
            CHANGE_CURRENT_NUM,
            Number(
              "-" +
              numStr
                .replace("-", "")
                .split("")
                .reverse()
                .join()
                .replaceAll(",", "")
            )
          );
        } else {
          this.$store.commit(
            CHANGE_CURRENT_NUM,
            Number(numStr.split("").reverse().join().replaceAll(",", ""))
          );
        }
      }
    },
  },
};
</script>

<style>
</style>