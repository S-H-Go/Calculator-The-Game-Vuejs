<template>
  <ScreenPanel></ScreenPanel>
  <ButtonPanel></ButtonPanel>
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
/* 
  * 禁止移动端长按选择功能
  * 来源: https://blog.csdn.net/Julylyna/article/details/79663162
  * 方法二会导致按钮失效
  * 方法三无效，故选择方法一
*/
*
{
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

html
{
  font-family: "Microsoft Yahei", simSun, Arial;
}

body
{
  padding: 0px;
  margin: 0px;
  border: 0px;
  background-color: #e4dccf;
}

div
{
  padding: 0;
  margin: 0;
}

#app
{
  width: 300px;
  height: 533px;
  padding: 10px 20px 40px 20px;
  margin: auto;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 36% 56%;
  row-gap: 8%;
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
@media screen and (max-width: 480px)
{
  #app
  {
    width: 92vw;
    height: 80vh;
    padding: 2vh 4vw 10vh 4vw;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 40% 60%;
    row-gap: 8%;
    background-color: #e4dccf;
  }
}
</style>
