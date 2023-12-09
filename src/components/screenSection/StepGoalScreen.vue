<script lang="ts" setup>
import { useStore } from '../../store'

const props = defineProps<{
  step: number
  goal: number
}>()
const store = useStore()
</script>

<template>
  <section id="info-display-section">
    <section style="line-height: 3rem">
      O(∩_∩)O
    </section>
    <section class="info-display" :class="{ blink: store.control.stepBlink }">
      <section>步数:</section>
      <section>{{ props.step }}</section>
    </section>
    <section class="info-display" :class="{ blink: store.control.goalBlink }">
      <section>目标:</section>
      <section>{{ props.goal }}</section>
    </section>
  </section>
</template>

<style>
/* 信息显示部分 */
#info-display-section
{
    height: var(--step-height);
    display: flex;
    justify-content: space-evenly;
    align-items: stretch;
    margin-top: 3%;
}

.info-display
{
    width: var(--step-width);
    height: var(--step-height);
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #3d3c3a;
    text-align: center;
    color: #a9b4aa;
    border-radius: 5%;
}
</style>
