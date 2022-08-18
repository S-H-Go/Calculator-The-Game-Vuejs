<template>
    <button class=" button color-button-1f2d3a">
        <p style="height: 0.5rem;font-size: 0.6rem;padding: 0;margin: 0;margin-bottom: 0.5rem;">等级</p>
        <p style="font-size: 2rem;padding: 0;margin: 0;margin-top:0.5rem;">{{
                store.allLevelData[store.data.currentLevelIndex].level
        }}</p>
    </button>

</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore()
</script>

<style>
</style>