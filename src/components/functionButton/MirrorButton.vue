<script lang="ts" setup>
import { useStore } from '../../store'

const props = defineProps<{
  currentNum: number
  step: number
}>()
const store = useStore()
function mirror() {
  if (props.step > 0) {
    const numArray = props.currentNum.toString().replace('-', '').split('')
    for (let i = numArray.length - 1; i >= 0; i--)
      numArray.push(numArray[i])

    if (props.currentNum.toString().includes('-'))
      store.changeCurrentNum(Number(`-${numArray.join('')}`))
    else
      store.changeCurrentNum(Number(numArray.join('')))
  }
}
</script>

<template>
  <button class="button color-button-orange" @click="mirror">
    Mirror
  </button>
</template>

<style>
</style>
