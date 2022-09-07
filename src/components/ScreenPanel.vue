<template>
  <div id="screen-panel">
    <level-screen :level=screenData.level></level-screen>
    <div id="display-section">
      <step-goal-screen :step=screenData.step :goal=screenData.goal></step-goal-screen>
      <info-screen></info-screen>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LevelScreen from "./screenSection/LevelScreen.vue";
import StepGoalScreen from "./screenSection/StepGoalScreen.vue";
import { useStore } from '../store'
import { computed } from 'vue';
import InfoScreen from "./screenSection/InfoScreen.vue";
const store = useStore()
const screenData = computed(() => store.getScreenData)
</script>
<style>
/* 边框部分 */
#screen-panel
{
  --step-width: 30%;
  --step-height: 3em;
  height: 100%;
  background-color: #3d3c3a;
  padding: 4% 4% 10%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 10% 90%;
  row-gap: 6%;
  flex-direction: column;
  border-radius: 5%;
}

/* 显示部分 */
#display-section
{
  background-color: #a8b7a2;
  display: flex;
  flex-direction: column;
  border-radius: 5%;
}
</style>