<template>
  <button @click="each" class="button color-button-orange">
    [{{ operation }}]{{ num1 }}
  </button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore();
const props = defineProps<{
  currentNum: number,
  operation: string,
  num1: number,
}>()
function each() {
  store.eachButton(props.operation, props.num1)
}
</script>

<style>
</style>