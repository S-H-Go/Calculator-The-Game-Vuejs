<template>
  <button @click="rightMove" class="function-button color-clr-button">
    &lt;&lt;
  </button>
</template>

<script>
export default {
  name: "RightMoveBUtton",
  props: {
    info: Object,
  },
  methods: {
    rightMove: function () {
      //if (this.info.step > 0) {
      let num = this.info.currentNum.toString();
      if (num == 0) {
        return;
      } else if (num.length === 1) {
        //如果只剩一位数
        this.$emit("changeCurrentNum", 0);
      } else {
        this.$emit("changeCurrentNum", num.slice(0, num.length - 1));
      }
      // }
    },
  },
};
</script>

<style>
</style>