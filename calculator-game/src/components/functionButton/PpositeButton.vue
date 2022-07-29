<template>
  <button @click="pposite" class="button color-button-orange">
    +/-
  </button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore()
const props = defineProps<{
  currentNum: number,
  step: number,
}>()
function pposite() {
  if (props.step > 0) {
    if (props.step > 0 && props.currentNum != 0) {
      store.changeCurrentNum(-1 * props.currentNum);
    }
  }
}
</script>

<style>
</style>