<script lang="ts" setup>
import { computed } from 'vue'
import { useGameStore } from '../../stores'
import { useLevelStore } from '../../stores/level'
import LedStyleCanvas from './LedStyleCanvas.vue'

const gameStore = useGameStore()
const screenData = computed(() => useLevelStore().screenInfo)
const screenControl = computed(() => gameStore.control)
</script>

<template>
  <div id="number-display-section">
    <LedStyleCanvas
      v-show="screenControl.showWhat === 'number'" id="number" :key="screenData.ledCanvasKey"
      :led-options="screenData.ledOptions" :portals="screenData.portals"
      :class="{ 'blink': gameStore.control.numberBlink, 'with-portals': screenData.portals }"
    />
    <div v-show="screenControl.showWhat === 'error'" id="error">
      ERROR
    </div>
    <div v-show="screenControl.showWhat === 'accomplish'" id="accomplish">
      完成
    </div>
    <div v-show="screenControl.showWhat === 'pause'" id="pause" :class="{ 'pause-blink': gameStore.control.pauseBlink }">
      暫停
    </div>
    <!-- :style="{ fontSize: fontSize + 'px' }" -->
    <div v-show="screenControl.showWhat === 'conversation'" id="conversation">
      {{ screenData.dialogue[screenData.dialogueIndex].info }}
    </div>
  </div>
</template>

<style scoped>
#number-display-section
{
    --margin-top: calc(0.06 * var(--vh));
    --margin-right: calc(0.05 * var(--vw));
}

#number
{
    text-align: right;
    margin-top: var(--margin-top);
}

#number.with-portals
{
    margin-top: calc(var(--margin-top) / 2);
}

#accomplish
{
    font-size: 60px;
    text-align: right;
    margin-top: calc(0.03 * var(--vh));
    margin-right: var(--margin-right);
}

#pause
{
    font-size: 60px;
    margin-top: calc(0.04 * var(--vh));
    text-align: center;
}

#error
{
    font-size: 60px;
    text-align: right;
    margin-top: calc(0.03 * var(--vh));
    margin-right: var(--margin-right);
}

#conversation
{
    font-size: 2rem;
    margin-left: var(--margin-right);
    text-align: left;
}

@media screen and (max-width:480px)
{
    #number-display-section
    {
        --margin-top: 6vh;
        --margin-right: 5vw;
    }

    #pause,
    #error,
    #accomplish
    {
        font-size: 56px;
        margin-top: 5vh;
    }
}
</style>
