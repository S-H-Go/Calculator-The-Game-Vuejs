<template>
  <button @click="cube" class="button color-button-orange">x³</button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore();
const props = defineProps<{
  currentNum: number,
  step: number,
}>()
function cube(): void {
  if (props.step > 0) {
    store.changeCurrentNum(Math.pow(props.currentNum, 3));
  }
}
</script>

<style>
</style>