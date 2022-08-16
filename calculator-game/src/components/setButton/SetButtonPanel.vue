<template>
    <div class="buttons-layout">
        <empty-button></empty-button>
        <empty-button></empty-button>
        <empty-button></empty-button>
        <level-reduction-button></level-reduction-button>
        <level-display-button></level-display-button>
        <level-increase-button></level-increase-button>
        <set-button></set-button>
        <empty-button></empty-button>
        <empty-button></empty-button>
    </div>
</template>

<script lang="ts" setup>
import SetButton from './SetButton.vue';
import EmptyButton from '../otherButtons/EmptyButton.vue';
import LevelReductionButton from './LevelReductionButton.vue';
import LevelDisplayButton from './LevelDisplayButton.vue';
import LevelIncreaseButton from './LevelIncreaseButton.vue';
</script>

<style>
</style>