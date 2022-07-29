<template>
  <button @click="replace" class="button color-button-orange">
    {{ num1 }}=&gt;{{ num2 }}
  </button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore()
const props = defineProps<{
  currentNum: number,
  step: number,
  num1: number,
  num2: number,
}>()
function replace() {
  if (props.step > 0) {
    let numStr = props.currentNum.toString();
    let reg = RegExp(props.num1.toString(), 'g');
    let resultStr = numStr.replace(reg, props.num2.toString());
    store.changeCurrentNum(Number(resultStr));
  }
}
</script>

<style>
</style>