<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore()
// 添加延时使:active执行完之后再切换 ButtonPanel
function setClick() {
  setTimeout(() => {
    store.changeMode()
  }, 100)
}
</script>

<template>
  <button class="button color-button-yeelow" @click="setClick()">
    设置
  </button>
</template>

<style>
</style>
