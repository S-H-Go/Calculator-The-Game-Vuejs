<template>
  <button @click="clr">CLR</button>
</template>

<script>
export default {
  name: "ClrBUtton",
  props: {
    initialNum: Number,
    initialStep: Number,
  },
  methods: {
    clr: function () {
      this.$emit("init");
    },
  },
};
</script>

<style>
</style>