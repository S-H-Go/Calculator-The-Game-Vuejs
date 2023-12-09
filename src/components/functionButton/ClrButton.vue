<script lang="ts" setup>
import { useStore } from '../../store/index'

const store = useStore()
function clr() {
  store.clr()
}
</script>

<template>
  <button class="button color-button-clr" @click="clr">
    CLR
  </button>
</template>

<style>
</style>
