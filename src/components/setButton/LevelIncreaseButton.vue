<template>
    <button @mousedown="continuousIncrease()" @mouseup="stopIncrease()" @mouseleave="stopIncrease()"
        class=" button color-button-6c96b6">+</button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore()
let increase = setInterval(() => { });
function continuousIncrease() {
    let isClick = true;
    increase = setInterval(() => {
        isClick = false;
        store.levelIncrease();
    }, 240);
    isClick ? store.levelIncrease() : "";
}
function stopIncrease() {
    clearInterval(increase);
}
</script>

<style>
</style>