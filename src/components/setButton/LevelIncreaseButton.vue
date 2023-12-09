<script lang="ts" setup>
import { useStore } from '../../store'

const store = useStore()
let increase = setInterval(() => { })
function continuousIncrease(event: string) {
  let isClick = true
  increase = setInterval(() => {
    isClick = false
    store.levelIncrease()
  }, 240)
  if (isClick && event === 'mousedown')
    store.levelIncrease()
}
function stopIncrease() {
  clearInterval(increase)
}
</script>

<template>
  <button
    class=" button color-button-6c96b6" @touchstart="continuousIncrease('touchstart')" @touchcancel="stopIncrease()"
    @touchend="stopIncrease" @mousedown="continuousIncrease('mousedown')" @mouseup="stopIncrease()"
    @mouseleave="stopIncrease()"
  >
    +
  </button>
</template>

<style>
</style>
