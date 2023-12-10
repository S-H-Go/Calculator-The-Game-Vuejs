<script lang="ts" setup>
import { useStore } from '../../store'

const props = defineProps<{
  currentNum: number
  operation: string
  num1: number
}>()
const store = useStore()
function each() {
  store.eachButton(props.operation, props.num1)
}
</script>

<template>
  <button class="button color-button-orange" @click="each">
    [{{ operation }}]{{ num1 }}
  </button>
</template>

<style>
</style>
