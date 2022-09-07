<template>
    <button @click="click()" class="button" :class="color" :style="{ fontSize: fontSize + 'px' }">
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
//根据字数动态设置字体大小
const fontSize = computed(() => {
    //获取 rem 大小
    const rem: number = Number(window.getComputedStyle(document.documentElement).fontSize.replace("px", ""));
    if (props.info != "<<" && props.info != "2") {
        switch (props.info.length) {
            case 1: return 3 * rem;
            case 2: return 2 * rem;
            case 3: return 1.5 * rem;
            case 4: return 1.5 * rem;
            case 5: return 1.5 * rem;
            case 6: return 1.5 * rem;
            case 7: return 1.3 * rem;
            case 9: return 1.1 * rem;
        }
    }
})
</script>

<style scoped>

</style>