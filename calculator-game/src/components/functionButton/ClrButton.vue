<template>
  <button @click="clr" class="button color-button-clr">
    CLR
  </button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store/index'
const store = useStore();
function clr() {
  store.clr()
}
</script>

<style>
</style>