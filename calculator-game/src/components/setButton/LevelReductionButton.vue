<template>
    <button @mousedown="continuousReduction()" @mouseup="stopReduction()" @mouseleave="stopReduction()"
        class="button color-button-orange">-</button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore()
let reduction = setInterval(() => { });
function continuousReduction() {
    let isClick = true;
    reduction = setInterval(() => {
        isClick = false;
        store.levelReduction();
    }, 240);//如果时间过小，会导致先执行下面的语句，从而造成点击会执行两次减少，暂时不清楚原因
    isClick ? store.levelReduction() : "";
}
function stopReduction() {
    clearInterval(reduction);
}
</script>

<style>
</style>