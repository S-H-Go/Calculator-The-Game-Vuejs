<template>
  <button @click="mirror" class="button color-button-orange">
    Mirror
  </button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore()
const props = defineProps<{
  currentNum: number,
  step: number,
}>()
function mirror() {
  if (props.step > 0) {
    let numArray = props.currentNum.toString().replace("-", "").split("");
    for (let i = numArray.length - 1; i >= 0; i--) {
      numArray.push(numArray[i]);
    }
    if (props.currentNum.toString().includes("-")) {
      store.changeCurrentNum(Number("-" + numArray.join("")))
    } else {
      store.changeCurrentNum(Number(numArray.join("")));
    }
  }
}
</script>

<style>
</style>