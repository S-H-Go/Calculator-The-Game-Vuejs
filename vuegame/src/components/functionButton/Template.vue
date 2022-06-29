<template>
  <button @click="Name" class="button color-button-orange"></button>
</template>

<script>
export default {
  name: "Name",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    Name: {},
  },
};
</script>

<style>
</style>