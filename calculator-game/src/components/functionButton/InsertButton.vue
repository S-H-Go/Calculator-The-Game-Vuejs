<template>
  <button @click="insert" class="button color-button-blue hide">
    {{ num1 }}
  </button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore();
const props = defineProps<{
  currentNum: number,
  step: number,
  num1: number,
}>()
function insert(): void {
  if (props.step > 0) {
    store.changeCurrentNum(Number(props.currentNum.toString() + props.num1));
  }
}
</script>

<style>
</style>