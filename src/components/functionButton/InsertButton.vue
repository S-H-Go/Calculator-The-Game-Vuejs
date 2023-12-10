<script lang="ts" setup>
import { useStore } from '../../store'

const props = defineProps<{
  currentNum: number
  step: number
  num1: number
}>()
const store = useStore()
function insert(): void {
  if (props.step > 0)
    store.changeCurrentNum(Number(props.currentNum.toString() + props.num1))
}
</script>

<template>
  <button class="button color-button-blue hide" @click="insert">
    {{ num1 }}
  </button>
</template>

<style>
</style>
