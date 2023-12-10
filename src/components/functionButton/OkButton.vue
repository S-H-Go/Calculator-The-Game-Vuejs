<script lang="ts" setup>
import { useStore } from '../../store'

const store = useStore()
function ok() {
  store.accomplish()
}
</script>

<template>
  <button class="button color-button-green" @click="ok">
    OK
  </button>
</template>

<style>
</style>
