<template>
    <button class=" button color-button-orange">
        <p style="height: 0.5rem;font-size: 0.6rem;padding: 0;margin: 0;margin-bottom: 0.5rem;">等级</p>
        <p style="font-size: 2rem;padding: 0;margin: 0;margin-top:0.5rem;">{{
                this.$store.state.allLevelData[this.$store.state.data.currentLevelIndex].level
        }}</p>
    </button>

</template>

<script>
export default {
    name: "LevelDisplayButton"
}
</script>

<style>
</style>