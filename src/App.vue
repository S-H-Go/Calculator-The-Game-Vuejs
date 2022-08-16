<template>
  <main>
    <ScreenPanel></ScreenPanel>
    <ButtonPanel></ButtonPanel>
  </main>
</template>

<script lang="ts" setup>
import ScreenPanel from './components/ScreenPanel.vue';
import ButtonPanel from './components/ButtonPanel.vue';
import { useStore } from './store/index'
import { onMounted } from 'vue';
const store = useStore();
onMounted(() => {
  store.levelInit();
})
</script>

<style>
html
{
  font-family: "Microsoft Yahei", simSun, Arial;
}

body
{
  padding: 0px;
  margin: 0px;
  border: 0px;
}

div
{
  padding: 0;
  margin: 0;
}

main
{
  width: 18rem;
  height: auto;
  margin: auto;
}

/*来自：https://blog.csdn.net/qq_16660859/article/details/111695771 */
a,
input,
button
{
  outline: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  -webkit-focus-ring-color: rgba(0, 0, 0, 0);
}

/* 手机端常规尺寸适配 */
@media screen and (max-width: 768px)
{
  main
  {
    width: 90vw;
    padding: 0 5vw;
  }
}
</style>
