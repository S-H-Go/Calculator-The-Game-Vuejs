<script lang="ts" setup>
import { useStore } from '../../store'

const props = defineProps<{
  currentNum: number
  step: number
  num1: number
  num2: number
}>()
const store = useStore()
function replace() {
  if (props.step > 0) {
    const numStr = props.currentNum.toString()
    const reg = RegExp(props.num1.toString(), 'g')
    const resultStr = numStr.replace(reg, props.num2.toString())
    store.changeCurrentNum(Number(resultStr))
  }
}
</script>

<template>
  <button class="button color-button-orange" @click="replace">
    {{ num1 }}=&gt;{{ num2 }}
  </button>
</template>

<style>
</style>
