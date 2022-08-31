<template>
    <button @click="click()" class="button" :class="color">
        {{ info }}
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../../store';
const store = useStore();
const props = defineProps<{
    info: string
}>()
function click() {
    if (props.info != "<<" && props.info != "insert2") {
        props.info != '不明白' ? store.conversationAccomplish() : store.jumpConversation()
    }
}
const color = computed(() => {
    switch (props.info) {
        case '不明白': {
            return "color-button-clr";
        }
        case "<<": {
            return "color-button-orange"
        }
        case "insert2": {
            return "color-button-blue"
        }
        default: {
            return "color-button-green"
        }
    }
});
const info = computed(() => {
    switch (props.info) {
        case "<<": {
            return "<<";
        } case "insert2": {
            return "2";
        }
        default: {
            return props.info;
        }
    }
})
</script>

<style scoped>
button
{
    font-size: 0.75rem;
}
</style>