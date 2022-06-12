<template>
  <button @click="Name" class="function-button color-button-orange"></button>
</template>

<script>
export default {
  name: "Name",
  props: {
    currentNum: Number,
    step: Number,
  },
  methods: {
    Name: function () {},
  },
};
</script>

<style>
</style>