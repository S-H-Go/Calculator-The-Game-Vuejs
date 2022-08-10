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
  --height: 15rem;
  --level-height: 2rem;
  --step-width: 5rem;
  --step-height: 3rem;
  height: var(--height);
  background-color: #3d3c3a;
  padding: 0.5rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  border-radius: 5%;
  margin: 0;
}

/* 显示部分 */
#display-section
{
  background-color: #a8b7a2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
  margin: 0;
  border-radius: 5%;
  height: calc(var(--height) - var(--height) * 0.1);
}

@media screen and (max-width: 768px)
{
  #screen-panel
  {
    --height: 16rem;
    --step-width: 6rem;
    --step-height: 4rem;
  }

  #display-section
  {
    height: calc(var(--height) - var(--height) * 0.15)
  }
}
</style>