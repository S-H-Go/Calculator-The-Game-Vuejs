<template>
  <button @click="store.changeMode()" class="button color-button-yeelow">设置</button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore()
</script>

<style>
</style>