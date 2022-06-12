<template>
  <button @click="ok" class="function-button color-button-green">OK</button>
</template>

<script>
export default {
  name: "OkButton",
  methods: {
    ok() {
      this.$store.commit("ACCOMPLISH");
    },
  },
};
</script>

<style>
</style>