<template>
  <button @click="ok" class="button color-button-green">OK</button>
</template>

<script>
import { ACCOMPLISH } from '@/store/mutation-types';
export default {
  name: "OkButton",
  methods: {
    ok() {
      this.$store.commit(ACCOMPLISH);
    },
  },
};
</script>

<style>
</style>