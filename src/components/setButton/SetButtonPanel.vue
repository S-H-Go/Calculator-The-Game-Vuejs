<template>
    <div class="buttons-layout">
        <empty-button></empty-button>
        <empty-button></empty-button>
        <empty-button></empty-button>
        <level-reduction-button></level-reduction-button>
        <level-display-button></level-display-button>
        <level-increase-button></level-increase-button>
        <set-button></set-button>
        <a href="https://github.com/S-H-Go/calculator-game-web"><button
                class="button color-button-purple">源代码</button></a>
        <a href="https://sweethg.club/2022-06-05/calculator-game/"><button
                class="button color-button-blue">一点小故事</button></a>
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