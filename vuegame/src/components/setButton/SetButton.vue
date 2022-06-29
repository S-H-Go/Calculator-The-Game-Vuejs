<template>
  <button @click="this.$store.commit('CHANGE_MODE')" class="button color-button-yeelow">设置</button>
</template>

<script>
export default {
  name: "SetButton",
};
</script>

<style>
</style>