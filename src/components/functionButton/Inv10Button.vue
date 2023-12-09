<script lang="ts" setup>
import { useStore } from '../../store'

const props = defineProps<{
  currentNum: number
  step: number
}>()
const store = useStore()
function inv10(): void {
  if (props.step > 0) {
    const numArray = props.currentNum.toString().split('')
    const resultArray = []
    for (const x of numArray) {
      if (x !== '0')
        resultArray.push(Number(10 - Number(x)))
      else
        resultArray.push(0)
    }
    store.changeCurrentNum(Number(resultArray.join('')))
  }
}
</script>

<template>
  <button class="button color-button-orange" @click="inv10">
    Inv10
  </button>
</template>

<style>
</style>
