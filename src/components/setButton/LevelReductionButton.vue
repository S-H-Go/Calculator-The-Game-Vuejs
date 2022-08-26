<template>
    <button @touchstart="continuousReduction('touchstart')" @touchcancel="stopReduction()" @touchend="stopReduction()"
        @mousedown="continuousReduction('mousedown')" @mouseup="stopReduction()" @mouseleave="stopReduction()"
        class="button color-button-6c96b6">-</button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore()
let reduction = setInterval(() => { });
function continuousReduction(event: string) {
    let isClick = true;
    reduction = setInterval(() => {
        isClick = false;
        store.levelReduction();
    }, 240);//如果时间过小，会导致先执行计时器，即鼠标点击一次会导致多次更改，触摸点击无影响，可能跟事件处理顺序导致的延迟有关。
    isClick && event == 'mousedown' ? store.levelReduction() : "";
}
function stopReduction() {
    clearInterval(reduction);
}
</script>

<style>
</style>