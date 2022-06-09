<template>
  <game-main
    :initialNum="initialNum"
    :initialStep="initialStep"
    :goal="goal"
  ></game-main>
</template>

<script>
import GameMain from "./components/GameMain.vue";
export default {
  name: "App",
  data() {
    return {
      initialNum: 2021,
      initialStep: 8,
      goal: 24,
    };
  },
  components: {
    GameMain,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
