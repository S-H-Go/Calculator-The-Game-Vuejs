<script lang="ts" setup>
import { useStore } from '../../store'

const props = defineProps<{
  currentNum: number
  step: number
}>()
const store = useStore()
function reverse() {
  // 分解成数组，逆转数组再合成字符串
  if (props.step > 0 && props.currentNum !== 0) {
    const numStr = props.currentNum.toString()
    if (numStr.includes('-')) {
      store.changeCurrentNum(
        Number(
          `-${
          numStr
            .replace('-', '')
            .split('')
            .reverse()
            .join('')}`,
        ),
      )
    }
    else {
      store.changeCurrentNum(Number(numStr.split('').reverse().join('')))
    }
  }
}
</script>

<template>
  <button class="button color-button-orange" @click="reverse">
    Reverse
  </button>
</template>

<style>
</style>
