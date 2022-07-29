<template>
    <button @click="store.levelSub()" class="button color-button-orange">-</button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore()
</script>

<style>
</style>