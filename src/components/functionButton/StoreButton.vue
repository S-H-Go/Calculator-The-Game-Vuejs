<script lang="ts" setup>
import { useStore } from '../../store'

const props = defineProps<{
  currentNum: number
  step: number
}>()

const store = useStore()

// 定时器
let loop = 0
// 长按存储操作
function onstore() {
  if (props.step > 0) {
    store.data.storeNum = props.currentNum
    // 做这个操作是为了步数减一
    store.changeCurrentNum(props.currentNum)
  }
}
// 单击放出并连接在后面的操作
function tackOut() {
  if (
    props.step > 0
    && Number.isFinite(store.data.storeNum)
    && loop !== 0
  ) {
    // 单击操作
    store.changeCurrentNum(
      Number(props.currentNum.toString() + store.data.storeNum),
    )
  }
}
function mouseDown() {
  // 计时器，500ms
  loop = setTimeout(() => {
    loop = 0
    onstore()
  }, 500)
  return false
}
function mouseLeave() {
  // 清除定时器
  clearTimeout(loop)
  loop = 0
}
function mouseUp() {
  clearTimeout(loop)
  tackOut()
}

function handlerTouchstart() {
  loop = setTimeout(() => {
    loop = 0
    onstore()
  }, 500) // 定时的时间
  return false
}
function handlerTouchmove() {
  // 清除定时器
  clearTimeout(loop)
  loop = 0
}

function handlerTouchend() {
  // 清除定时器
  clearTimeout(loop)
  tackOut()
}
</script>

<template>
  <button
    id="store-button" class="button color-button-purple" @mousedown="mouseDown" @mouseout="mouseLeave"
    @mouseup="mouseUp" @touchstart="handlerTouchstart" @touchmove="handlerTouchmove"
    @touchend="handlerTouchend"
  >
    {{ store.data.storeNum }}
  </button>
</template>

<style>
/* 禁止长按选择 */
#store-button
{
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
