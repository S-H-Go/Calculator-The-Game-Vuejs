<script lang="ts" setup>
import { useStore } from '../../store'

const props = defineProps<{
  currentNum: number
  step: number
}>()
const store = useStore()
function sum() {
  if (props.step > 0 && props.currentNum !== 0) {
    // 去除负号后的当前数字的字符串
    const numStr = props.currentNum.toString().replace('-', '')
    let sum = 0
    for (const i of numStr)
      sum += Number(i)

    if (props.currentNum.toString().includes('-'))
      sum *= -1

    store.changeCurrentNum(sum)
  }
}
</script>

<template>
  <button class="button color-button-orange" @click="sum">
    SUM
  </button>
</template>

<style>
</style>
