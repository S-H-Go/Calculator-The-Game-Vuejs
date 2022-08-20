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
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

#level-screen
{
    color: #dadfe1;
    font-style: italic;
    margin-left: 5%;
}

/* 链接样式 */
#play-link
{
    margin: 0;
    color: #dadfe1;
    text-decoration: none;
    margin-right: 5%;
}

#play-link:hover
{
    color: #ea6c18;
}
</style>