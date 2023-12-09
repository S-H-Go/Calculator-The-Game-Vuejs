<script lang="ts" setup>
import { useStore } from '../../store'

const props = defineProps<{
  currentNum: number
  step: number
}>()
const store = useStore()
function rightMove() {
  const numStr = props.currentNum.toString()
  if (props.step > 0 && props.currentNum !== 0) {
    // 如果是负数，并且长度为2时，更改为0
    if (numStr.includes('-') && numStr.length === 2) {
      store.changeCurrentNum(0)
      return
    }
    // 不是负数如果只剩一位数
    if (numStr.length === 1) {
      store.changeCurrentNum(0)
      return
    }
    store.changeCurrentNum(
      Number(numStr.slice(0, numStr.length - 1)),
    )
  }
}
</script>

<template>
  <button class="button color-button-orange" @click="rightMove">
    &lt;&lt;
  </button>
</template>

<style>
</style>
