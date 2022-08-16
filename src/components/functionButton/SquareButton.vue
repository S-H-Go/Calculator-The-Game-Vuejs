<template>
  <button @click="square" class="button color-button-orange">
    x²
  </button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore()
const props = defineProps<{
  currentNum: number,
  step: number,
}>()
function square() {
  if (props.currentNum == 0 || props.step == 0) {
    return;
  }
  store.changeCurrentNum(Math.pow(props.currentNum, 2));
}

</script>

<style>
</style>