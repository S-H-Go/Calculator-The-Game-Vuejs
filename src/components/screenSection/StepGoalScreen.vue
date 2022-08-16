<template>
    <section id="info-display-section">
        <section style="line-height: 3rem">O(∩_∩)O</section>


        <section class="info-display">
            <section class="info-text-display">步数:</section>
            <section class="info-num-diaplay">{{ props.step }}</section>
        </section>
        <section class="info-display">
            <section class="info-text-display">目标:</section>
            <section class="info-num-display">{{ props.goal }}</section>
        </section>
    </section>

</template>

<script lang="ts" setup>
const props = defineProps<{
    step: number,
    goal: number
}>()
</script>

<style>
/* 信息显示部分 */
#info-display-section
{
    height: var(--step-height);
    display: flex;
    justify-content: space-evenly;
    align-items: stretch;
    padding: 0;
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
    margin-right: 0.5em;
    margin-top: 0.5em;
    border-radius: 5%;
}
</style>