<template>
    <div id="function-button-panel">
        <div id="other-button-section">
            <set-button></set-button>
        </div>
        <div id="function-button-section">
            <ok-button v-show="buttonControl.accomplish"></ok-button>
            <clr-button v-show="!buttonControl.accomplish"></clr-button>
            <component :is="item.tag" v-for="item of buttonList" :key="item.id" :currentNum="buttonData.currentNum"
                :step="buttonData.step" :operation="item.operation ? item.operation : null"
                :num1="item.num1 ? item.num1 : null" :num2="item.num2 ? item.num2 : null"></component>
        </div>
    </div>
</template>

<script>
import ClrButton from "./ClrButton.vue";
import { mapGetters } from "vuex";
import OkButton from "./OkButton.vue";
import SetButton from "../setButton/SetButton.vue";

export default {
    name: "FunctionButtonPanel",
    computed: {
        ...mapGetters(["buttonData", "buttonList", "buttonControl"]),
    },
    components: {
        ClrButton,
        OkButton,
        SetButton,
    },
};
</script>

<style>
#function-button-panel {
    width: calc(var(--button-width) * 3 + var(--button-margin-left) * 6);
    height: calc(var(--button-margin-top) * 3 + var(--button-height) * 3);
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-start;
    padding: 0;
}

#other-button-section {
    width: calc(var(--button-width) + var(--button-margin-left) * 2);
    height: calc(var(--button-margin-top) * 3 + var(--button-height) * 3);
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column-reverse;
}

#function-button-section {
    display: flex;
    width: calc(var(--button-width) * 2 + var(--button-margin-left) * 4);
    height: calc(var(--button-margin-top) * 3 + var(--button-height) * 3);
    flex-direction: row-reverse;
    flex-wrap: wrap;
    align-content: flex-start;
    margin: 0;
    padding-top: 0;
}
</style>