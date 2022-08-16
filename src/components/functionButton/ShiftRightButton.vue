<template>
  <button @click="shiftRight" class="button color-button-orange">
    Shift&gt;
  </button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore()
const props = defineProps<{
  currentNum: Number,
  step: Number,
}>()
function shiftRight() {
  if (props.step > 0 && props.currentNum != 0) {
    const numStr = props.currentNum.toString().replace("-", "");
    let numArray = numStr.split("");
    numArray.unshift(String(numArray.pop()));
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