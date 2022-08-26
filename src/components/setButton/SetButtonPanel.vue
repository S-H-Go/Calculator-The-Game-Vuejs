<template>
    <div class="buttons-layout">
        <component :is="emptyButton ? emptyButton.tag : ''"></component>
        <component :is="emptyButton ? emptyButton.tag : ''"></component>
        <component :is="emptyButton ? emptyButton.tag : ''"></component>
        <level-reduction-button></level-reduction-button>
        <level-display-button></level-display-button>
        <level-increase-button></level-increase-button>
        <component :is="setButton ? setButton.tag : ''"></component>
        <a href=" https://github.com/S-H-Go/calculator-game-web"><button
                class="button color-button-purple">源代码</button></a>
        <a href="https://sweethg.club/2022-06-05/calculator-game/"><button
                class="button color-button-blue">一点小故事</button></a>
    </div>
</template>

<script lang="ts" setup>
import LevelReductionButton from './LevelReductionButton.vue';
import LevelDisplayButton from './LevelDisplayButton.vue';
import LevelIncreaseButton from './LevelIncreaseButton.vue';
import { SEButtonFactory } from '../../store/buttonFactory';
import { SEButtonEnum } from '../../store/ButtonsControl';
const setButton = SEButtonFactory(SEButtonEnum.set);
const emptyButton = SEButtonFactory(SEButtonEnum.empty);
</script>

<style>
</style>