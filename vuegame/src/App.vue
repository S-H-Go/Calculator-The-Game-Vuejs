<template>
  <div>
    <game-main
      :initialNumber="initialNum"
      :stepNumber="stepNum"
      :goalNumber="goalNum"
    ></game-main>
  </div>
</template>

<script>
import GameMain from "./components/GameMain.vue";
export default {
  name: "App",
  data() {
    return {
      initialNum: 2021,
      stepNum: 8,
      goalNum: 24,
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
  margin-top: 60px;
}
</style>
