<template>
  <button @click="name" class="button color-button-orange"></button>
</template>

<script>
export default {
  name: "TemplateVue",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    name: {},
  },
};
</script>

<style>
</style>