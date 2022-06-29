<template>
  <button id="store-button" @mousedown="mouseDown" @mouseout="mouseLeave" @mouseup="mouseUp"
    @touchstart="handlerTouchstart" @touchmove="handlerTouchmove" @touchend="handlerTouchend"
    class="button color-button-purple">
    {{ this.$store.state.data.storeNum }}
  </button>
</template>

<script>
import { CHANGE_CURRENT_NUM } from '@/store/mutation-types'

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
    //长按存储操作
    store() {
      if (this.step > 0) {
        this.$store.state.data.storeNum = Number(this.currentNum);
        //做这个操作是为了步数减一
        this.$store.commit(CHANGE_CURRENT_NUM, this.currentNum);
      }
    },
    //单击放出并连接在后面的操作
    tackOut() {
      if (
        this.step > 0 &&
        Number.isFinite(this.$store.state.data.storeNum) &&
        this.loop !== 0
      ) {
        //单击操作
        this.$store.commit(
          CHANGE_CURRENT_NUM,
          Number(this.currentNum.toString() + this.$store.state.data.storeNum)
        );
      }
    },
    mouseDown() {
      //计时器，500ms
      this.loop = setTimeout(() => {
        this.loop = 0;
        this.store();
      }, 500);
      return false;
    },
    mouseLeave() {
      // 清除定时器
      clearTimeout(this.loop);
      this.loop = 0;
    },
    mouseUp() {
      clearTimeout(this.loop);
      this.tackOut();
    },
    handlerTouchstart() {
      this.loop = setTimeout(() => {
        this.loop = 0;
        this.store();
      }, 500); // 定时的时间
      return false;
    },
    handlerTouchmove() {
      // 清除定时器
      clearTimeout(this.loop);
      this.loop = 0;
    },
    handlerTouchend() {
      // 清除定时器
      clearTimeout(this.loop);
      this.tackOut();
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