<template>
  <button @click="set" class="function-button color-button-yeelow">设置</button>
</template>

<script>
export default {
  name: "SetButton",
  methods: {
    set() {
      if (this.$store.state.control.setMode) {
        //如果是设置模式，点击就切换初始模式
        this.$store.state.control.initialMode = true;
        this.$store.state.control.setMode = false;
      } else {
        this.$store.state.control.setMode = true;
        this.$store.state.control.initialMode = false;
      }
    },
  },
};
</script>

<style>
.color-button-yeelow {
  background-color: rgb(202, 202, 44);
  box-shadow: 0rem 0.4rem hsl(60, 50%, 40%);
}
</style>