<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from '../../store'
import LedStyleCanvas from './LedStyleCanvas.vue'

const store = useStore()
const screenData = computed(() => store.getScreenData)
const screenControl = computed(() => store.getScreenControl)
// 动态字体大小
// const fontSize = computed(() => {
//     let width: number = document.getElementById("number-display-section")?.clientWidth as number;
//     let height: number = document.getElementById("number-display-section")?.clientHeight as number;
//     const reg = RegExp(" ", 'g');
//     let marginRight = ["0", "0"];
//     if (document.getElementById("number-display-section") != null) {
//         marginRight = getComputedStyle(document.getElementById("number-display-section") as HTMLElement).getPropertyValue('--margin-right').replace("calc(", "").replace("px)", "").replace(reg, "").split("*");
//     }
//     width -= (Number(marginRight[0]) * Number(marginRight[1]) * 2);
//     let length: number = store.data.conversation[store.data.conversationIndex].info.length;
//     let fs = 0;
//     fs = (Math.sqrt((width + height) * (width + height) + 4 * width * height * length - 4 * width * height) - width - height) / (2 * length - 2);
//     console.log("width:", width);
//     console.log("height:", height);
//     console.log("fs", fs);
//     // return fs;
//     // while (Math.ceil(length / Math.floor(width / fs)) * fs < height) {
//     //     fs++;
//     //     // console.log("+++");
//     // }
//     return fs;
// });
</script>

<template>
  <div id="number-display-section">
    <LedStyleCanvas
      v-show="screenControl.showWhat === 'number'" id="number" :key="screenData.ledCanvasKey"
      :led-options="screenData.ledOptions" :class="{ blink: store.control.numberBlink }"
    />
    <div v-show="screenControl.showWhat === 'error'" id="error">
      {{ screenData.errorInfo }}
    </div>
    <div v-show="screenControl.showWhat === 'accomplish'" id="accomplish">
      {{ screenData.accomplishInfo }}
    </div>
    <div v-show="screenControl.showWhat === 'pause'" id="pause" :class="{ 'pause-blink': store.control.pauseBlink }">
      {{ screenData.pauseInfo }}
    </div>
    <!-- :style="{ fontSize: fontSize + 'px' }" -->
    <div v-show="screenControl.showWhat === 'conversation'" id="conversation">
      {{ screenData.conversation[screenData.conversationIndex].info }}
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
