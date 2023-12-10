<script lang="ts" setup>
import { useStore } from '../../store'

const props = defineProps<{
  currentNum: number
  step: number
}>()
const store = useStore()
function cube(): void {
  if (props.step > 0)
    store.changeCurrentNum(props.currentNum ** 3)
}
</script>

<template>
  <button class="button color-button-orange" @click="cube">
    x³
  </button>
</template>

<style>
</style>
