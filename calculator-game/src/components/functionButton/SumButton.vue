<template>
  <button @click="sum" class="button color-button-orange">SUM</button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore()
const props = defineProps<{
  currentNum: number,
  step: number,
}>()
function sum() {
  if (props.step > 0 && props.currentNum != 0) {
    //去除负号后的当前数字的字符串
    const numStr = props.currentNum.toString().replace("-", "");
    let sum = 0;
    for (let i of numStr) {
      sum += Number(i);
    }
    if (props.currentNum.toString().includes("-")) {
      sum *= -1;
    }
    store.changeCurrentNum(sum);
  }
}
</script>

<style>
</style>