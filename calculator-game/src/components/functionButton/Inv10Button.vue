<template>
  <button @click="inv10" class="button color-button-orange">
    Inv10
  </button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore();
const props = defineProps<{
  currentNum: number,
  step: number,
}>()

function inv10(): void {
  if (props.step > 0) {
    let numArray = props.currentNum.toString().split("");
    let resultArray = [];
    for (let x of numArray) {
      if (x != '0') {
        resultArray.push(Number(10 - Number(x)));
      } else {
        resultArray.push(0);
      }
    }
    store.changeCurrentNum(Number(resultArray.join("")));
  }
}
</script>

<style>
</style>