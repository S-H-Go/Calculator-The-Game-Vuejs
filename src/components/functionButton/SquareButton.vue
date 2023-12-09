<script lang="ts" setup>
import { useStore } from '../../store'

const props = defineProps<{
  currentNum: number
  step: number
}>()
const store = useStore()
function square() {
  if (props.currentNum === 0 || props.step === 0)
    return

  store.changeCurrentNum(props.currentNum ** 2)
}
</script>

<template>
  <button class="button color-button-orange" @click="square">
    x²
  </button>
</template>

<style>
</style>
