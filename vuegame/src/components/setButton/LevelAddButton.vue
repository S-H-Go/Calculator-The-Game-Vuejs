<template>
    <button @click="this.$store.commit('LEVEL_ADD')" class=" button color-button-orange">+</button>
</template>

<script>
export default {
    name: "LevelAddButton",
};
</script>

<style>
</style>