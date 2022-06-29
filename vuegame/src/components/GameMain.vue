<template>
  <main id="main">
    <screen-section></screen-section>
    <button-section></button-section>
  </main>
</template>

<script>
import ScreenSection from "./ScreenPanel.vue";
import ButtonSection from "./ButtonPanel.vue";
import { mapMutations } from "vuex";

export default {
  name: "GameMain",
  components: { ButtonSection, ScreenSection },
  methods: {
    ...mapMutations({
      changeLevel: "CHANGE_LEVEL",
    }),
  },
};
</script>

<style>
html {
  --rem: 16px;
  font-family: "Microsoft Yahei", simSun, Arial;
  font-size: var(--rem);
}

body {
  padding: 0px;
  margin: 0px;
  border: 0px;
}

#main {
  width: 18rem;
  height: 50rem;
  margin: auto;
}
</style>
