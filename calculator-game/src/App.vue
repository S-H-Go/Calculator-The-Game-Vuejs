<template>
  <main>
    <screen-panel></screen-panel>
    <button-panel></button-panel>
  </main>
</template>

<script>
import ScreenPanel from './components/ScreenPanel.vue';
import ButtonPanel from './components/ButtonPanel.vue';
export default {
  name: "App",
  components: {
    ScreenPanel,
    ButtonPanel
  },
};
</script>

<style>
html {
  font-family: "Microsoft Yahei", simSun, Arial;
}

body {
  padding: 0px;
  margin: 0px;
  border: 0px;
}

div {
  padding: 0;
  margin: 0;
}

main {
  width: 18rem;
  height: auto;
  margin: auto;
}

/* 手机端常规尺寸适配 */
@media screen and (max-width: 768px) {
  main {
    width: 90vw;
    padding: 0 5vw;
  }
}
</style>
