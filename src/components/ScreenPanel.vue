<script lang="ts" setup>
import { computed } from 'vue'
import { useLevelStore } from '../stores/level'
import InfoScreen from './screenSection/InfoScreen.vue'
import LevelScreen from './screenSection/LevelScreen.vue'
import StepGoalScreen from './screenSection/StepGoalScreen.vue'

const store = useLevelStore()
const screenData = computed(() => store.screenInfo)
</script>

<template>
  <div id="screen-panel">
    <LevelScreen :level="screenData.level" />
    <div id="display-section">
      <StepGoalScreen :step="screenData.currentStep" :goal="screenData.goal" />
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
  --screen-bottom-trim: 16px;
  padding: 4% 4% calc(10% - var(--screen-bottom-trim));
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
  height: calc(100% - var(--screen-bottom-trim));
  background-color: #a8b7a2;
  display: flex;
  flex-direction: column;
  border-radius: 5%;
}
</style>
