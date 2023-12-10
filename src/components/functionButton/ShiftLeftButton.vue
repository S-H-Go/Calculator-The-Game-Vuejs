<script lang="ts" setup>
import { useStore } from '../../store'

const props = defineProps<{
  currentNum: number
  step: number
}>()
const store = useStore()
function shiftLeft() {
  if (props.step > 0 && props.currentNum !== 0) {
    const numStr = props.currentNum.toString().replace('-', '')
    const numArray = numStr.split('')
    numArray.push(String(numArray.shift()))
    if (props.currentNum.toString().includes('-')) {
      // 如果是负数
      store.changeCurrentNum(
        Number(`-${numArray.join('')}`),
      )
    }
    else {
      store.changeCurrentNum(
        Number(numArray.join('')),
      )
    }
  }
}
</script>

<template>
  <button class="button color-button-orange" @click="shiftLeft">
    Shift&lt;
  </button>
</template>

<style>
</style>
