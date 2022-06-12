<template>
  <button @click="reverse" class="function-button color-button-orange">Reverse</button>
</template>

<script>
export default {
  name: "ReverseButton",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    reverse: function () {
      if (this.step > 0 && this.currentNum != 0) {
        let numStr = this.currentNum.toString();
        if (numStr.includes("-")) {
          this.$emit(
            "changeCurrentNum",
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
          this.$emit(
            "changeCurrentNum",
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