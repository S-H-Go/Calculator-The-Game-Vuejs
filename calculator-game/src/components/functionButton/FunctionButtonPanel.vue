<template>
    <div id="function-button-panel">
        <template v-for="buttonList of store.buttons">
            <component :is="item.tag" v-for="item of buttonList" :key="item.id" :currentNum="buttonData.currentNum"
                :step="buttonData.step" :operation="item.operation" :num1="item.num1" :num2="item.num2"
                :info="item.info"></component>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
import { computed } from "vue";
const store = useStore();
const buttonData = computed(() => store.getButtonData)
const screenControl = computed(() => store.getScreenControl);
</script>

<style>
#function-button-panel
{
    width: calc(var(--button-width) * 3 + var(--button-margin-left) * 6);
    height: calc(var(--button-margin-top) * 3 + var(--button-height) * 3);
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    padding: 0;
}
</style>