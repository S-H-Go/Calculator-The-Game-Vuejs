<template>
    <section id="number-display-section">
        <led-style-canvas v-show="screenControl.ledCanvasDisplay && !screenControl.setMode"
            :ledOptions="screenData.ledOptions" :key="screenData.ledCanvasKey"></led-style-canvas>
        <div v-show="
            screenControl.initialMode &&
            !screenControl.ledCanvasDisplay &&
            screenControl.error
        " id="error">
            {{ screenData.errorInfo }}
        </div>
        <div v-show="
            screenControl.initialMode &&
            !screenControl.ledCanvasDisplay &&
            screenControl.accomplish
        " id="accomplish">
            {{ screenData.accomplishInfo }}
        </div>
        <div id="pause" v-show="screenControl.setMode && !screenControl.initialMode">
            {{ screenData.pauseInfo }}
        </div>
    </section>
</template>

<script lang="ts" setup>
import LedStyleCanvas from './LedStyleCanvas.vue';
import { useStore } from '../../store'
import { computed } from 'vue';
const store = useStore()
const screenData = computed(() => store.getScreenData)
const screenControl = computed(() => store.getScreenControl)
</script>

<style>
/* 数字显示部分 */
#number-display-section
{
    --margin-right: 1rem;
    text-align: right;
    margin-top: 2rem;
    margin-bottom: 3rem;
}

#accomplish
{
    font-size: 3rem;
    text-align: right;
    margin-right: var(--margin-right);
}

#pause
{
    font-size: 3rem;
    padding: 0;
    margin: 0;
    text-align: center;
}

#error
{
    font-size: 3rem;
    text-align: right;
    padding-right: 0.5rem;
    margin-right: var(--margin-right);
}

@media screen and (max-width: 768px)
{
    #number-display-section
    {
        margin-top: 3rem;
        margin-bottom: 4rem;
    }
}
</style>