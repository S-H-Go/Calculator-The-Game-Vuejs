<template>
    <section id="head">
        <span id="level-screen">等级: {{ props.level }}</span>
        <a id="play-link" href="https://play.google.com/store/apps/details?id=com.sm.calculateme">Calculator:The
            Game</a>
    </section>
</template>

<script lang="ts" setup>
const props = defineProps<{
    level: number
}>()
</script>

<style>
#head
{
    height: var(--level-height);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

#level-screen
{
    font-size: 1rem;
    margin-left: 0.5rem;
    color: azure;
    font-style: italic;
}

/* 链接样式 */
#play-link
{
    font-size: 0.5rem;
    margin: 0;
    color: white;
    text-decoration: none;
}

#play-link:hover
{
    color: #ea6c18;
}
</style>