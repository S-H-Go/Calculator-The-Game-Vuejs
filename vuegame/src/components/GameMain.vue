<template>
  <main id="main">
    <screen-section></screen-section>
    <button-section></button-section>
  </main>
</template>

<script>
import ScreenSection from "./ScreenSection.vue";
import ButtonSection from "./ButtonSection.vue";
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
body {
  --rem: 16px;
  padding: 0px;
  margin: 0px;
  border: 0px;
  font-family: "Microsoft Yahei", simSun, Arial;
  font-size: var(--rem);
}
#main {
  height: 30rem;
  width: 15rem;
  margin: auto;
}
</style>
