<template>
    <div class="buttons-layout">
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
</script>

<style>
</style>