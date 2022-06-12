<template>
  <button
    id="store-button"
    @mousedown="mouseDown"
    @mouseout="mouseLeave"
    @mouseup="mouseUp"
    @touchstart="handlerTouchstart"
    @touchmove="handlerTouchmove"
    @touchend="handlerTouchend"
    class="function-button color-button-purple"
  >
    {{ this.$store.state.data.storeNum }}
  </button>
</template>

<script>
export default {
  name: "StoreButton",
  props: {
    currentNum: Number,
    step: Number,
  },
  data() {
    return {
      // 定时器
      loop: 0,
    };
  },
  methods: {
    mouseDown: function () {
      //计时器，500ms
      this.loop = setTimeout(() => {
        this.loop = 0;
        if (this.step > 0) {
          this.$store.state.data.storeNum = Number(this.currentNum);
          this.$emit("changeCurrentNum", this.currentNum);
        }
      }, 500);
      return false;
    },
    mouseLeave: function () {
      // 清除定时器
      clearTimeout(this.loop);
      this.loop = 0;
    },
    mouseUp: function () {
      clearTimeout(this.loop);
      if (
        this.step > 0 &&
        Number.isFinite(this.$store.state.data.storeNum) &&
        this.loop !== 0
      ) {
        //单击操作
        this.$emit(
          "changeCurrentNum",
          Number(this.currentNum.toString() + this.$store.state.data.storeNum)
        );
      }
    },
    handlerTouchstart: function () {
      this.loop = setTimeout(() => {
        this.loop = 0;
        // 执行长按要执行的内容
        if (this.step > 0) {
          this.$store.state.data.storeNum = this.currentNum;
          this.$emit("changeCurrentNum", this.currentNum);
        }
      }, 500); // 定时的时间
      return false;
    },
    handlerTouchmove: function () {
      // 清除定时器
      clearTimeout(this.loop);
      this.loop = 0;
    },
    handlerTouchend: function () {
      // 清除定时器
      clearTimeout(this.loop);
      if (this.loop !== 0) {
        // 单击操作
        this.$emit(
          "changeCurrentNum",
          Number(this.currentNum.toString() + this.$store.state.data.storeNum)
        );
      }
    },
  },
};
</script>

<style>
#store-button {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>