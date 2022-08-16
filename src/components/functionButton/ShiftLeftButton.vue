<template>
  <button @click="shiftLeft" class="button color-button-orange">
    Shift&lt;
  </button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore()
const props = defineProps<{
  currentNum: number,
  step: number,
}>()
function shiftLeft() {
  if (props.step > 0 && props.currentNum != 0) {
    const numStr = props.currentNum.toString().replace("-", "");
    let numArray = numStr.split("");
    numArray.push(String(numArray.shift()));
    if (props.currentNum.toString().includes("-")) {
      //如果是负数
      store.changeCurrentNum(
        Number("-" + numArray.join(""))
      );
    } else {
      store.changeCurrentNum(
        Number(numArray.join(""))
      );
    }
  }
}
</script>

<style>
</style>