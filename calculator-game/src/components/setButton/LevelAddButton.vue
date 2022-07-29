<template>
    <button @click="store.levelAdd()" class=" button color-button-orange">+</button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore()

</script>

<style>
</style>