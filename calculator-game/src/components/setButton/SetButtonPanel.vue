<template>
    <table id="set-button-table">
        <tr>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>
                <level-sub-button class="font-size"></level-sub-button>
            </td>
            <td>
                <level-display-button></level-display-button>
            </td>
            <td>
                <level-add-button class="font-size"></level-add-button>
            </td>
        </tr>
        <tr>
            <td>
                <set-button></set-button>
            </td>
            <td></td>
            <td></td>
        </tr>
    </table>
</template>

<script>
import SetButton from './SetButton.vue';
import LevelSubButton from './LevelSubButton.vue';
import LevelDisplayButton from './LevelDisplayButton.vue';
import LevelAddButton from './LevelAddButton.vue';
export default {
    name: "SetButtonPanel",
    components: { SetButton, LevelSubButton, LevelDisplayButton, LevelAddButton }
}
</script>

<style>
.font-size {
    font-size: 2rem;
}

#set-button-table {
    border-spacing: 0 0;
    width: calc(var(--button-width) *3 + var(--button-margin-left) * 6);
    height: calc(var(--button-margin-top) * 3 + var(--button-height) * 3);
}

#set-button-table tr {
    border: 0;
    height: calc(var(--button-height) + var(--button-margin-top));
}

#set-button-table tr td {
    padding: 0;
    width: calc(var(--button-width) + var(--button-margin-left) * 2);
}
</style>