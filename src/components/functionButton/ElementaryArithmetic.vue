<script lang="ts" setup>
// 四则运算按钮
import { useStore } from '../../store'

const props = defineProps<{
  currentNum: number
  step: number
  operation: string
  num1: number
}>()
const store = useStore()
function elementaryArithmetic() {
  if (props.step > 0) {
    switch (props.operation) {
      case '+': {
        store.changeCurrentNum(props.currentNum + props.num1)
        break
      }
      case '-': {
        store.changeCurrentNum(props.currentNum - props.num1)
        break
      }
      case 'x': {
        if (props.currentNum !== 0)
          store.changeCurrentNum(props.currentNum * props.num1)

        break
      }
      case '/': {
        if (props.currentNum !== 0 && props.num1 !== 0)
          store.changeCurrentNum(props.currentNum / props.num1)

        break
      }
    }
  }
}
</script>

<template>
  <button class="button color-button-grey" @click="elementaryArithmetic()">
    {{ operation }} {{ num1 }}
  </button>
</template>

<style>
</style>
