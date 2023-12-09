<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from '../store'
import LevelScreen from './screenSection/LevelScreen.vue'
import StepGoalScreen from './screenSection/StepGoalScreen.vue'
import InfoScreen from './screenSection/InfoScreen.vue'

const store = useStore()
const screenData = computed(() => store.getScreenData)
</script>

<template>
  <div id="screen-panel">
    <LevelScreen :level="screenData.level" />
    <div id="display-section">
      <StepGoalScreen :step="screenData.step" :goal="screenData.goal" />
      <InfoScreen />
    </div>
  </div>
</template>

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
