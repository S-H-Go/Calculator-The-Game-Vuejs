<template>
  <button @click="ok" class="button color-button-green">OK</button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore()
function ok() {
  store.accomplish();
}
</script>

<style>
</style>