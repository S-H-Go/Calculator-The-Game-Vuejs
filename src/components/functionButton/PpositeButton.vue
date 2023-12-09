<script lang="ts" setup>
import { useStore } from '../../store'

const props = defineProps<{
  currentNum: number
  step: number
}>()
const store = useStore()
function pposite() {
  if (props.step > 0) {
    if (props.step > 0 && props.currentNum !== 0)
      store.changeCurrentNum(-1 * props.currentNum)
  }
}
</script>

<template>
  <button class="button color-button-orange" @click="pposite">
    +/-
  </button>
</template>

<style>
</style>
