<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from '../store'
import FunctionButtonPanel from './functionButton/FunctionButtonPanel.vue'
import SetButtonPanel from './setButton/SetButtonPanel.vue'

const store = useStore()
const buttonControl = computed(() => store.getButtonControl)
</script>

<template>
  <div id="button-panel">
    <SetButtonPanel v-show="buttonControl.showWhat === 'pause'" />
    <FunctionButtonPanel v-show="buttonControl.showWhat !== 'pause'" />
  </div>
</template>

<style>
#button-panel
{
  width: 100%;
  height: 100%;
  --button-width: calc(0.29 * var(--vw));
  --button-height: calc(0.12 * var(--vh));
  --button-margin-top: calc(0.03 * var(--vh));
  --button-margin-left: calc(0.01 * var(--vw));
  --button-margin-right: calc(0.01 * var(--vw));
  --button-border-size: calc(0.02 * var(--vh));
  --button-border-radius: 8%;
}

/* clr按钮的颜色 */
.color-button-clr
{
  background-color: #c72f2e;
  box-shadow: 0px var(--button-border-size) #912322;
}

.color-button-clr:active
{
  position: relative;
  top: calc(var(--button-margin-top) / 2);
  box-shadow: 0px calc(var(--button-margin-top) / 6) #912322;
}

/* 插入按钮的颜色 */
.color-button-blue
{
  background-color: #8b7cd7;
  box-shadow: 0px var(--button-border-size) #473984;
}

.color-button-blue:active
{
  position: relative;
  top: calc(var(--button-margin-top) / 2);
  box-shadow: 0px calc(var(--button-margin-top) / 6) #473984;
}

/* 四则运算按钮的颜色 */
.color-button-grey
{
  background-color: #45494c;
  box-shadow: 0px var(--button-border-size) #18191b;
}

.color-button-grey:active
{
  position: relative;
  top: calc(var(--button-margin-top) / 2);
  box-shadow: 0px calc(var(--button-margin-top) / 6) #18191b;
}

/* OK按钮、对话按钮的颜色， */
.color-button-green
{
  background-color: #48ac30;
  box-shadow: 0px var(--button-border-size) #368323;
}

.color-button-green:active
{
  position: relative;
  top: calc(var(--button-margin-top) / 2);
  box-shadow: 0px calc(var(--button-margin-top) / 6) #368323;
}

/* 单目操作按钮的颜色 */
.color-button-orange
{
  background-color: #ea6c17;
  box-shadow: 0rem var(--button-border-size) #b44800;
}

.color-button-orange:active
{
  position: relative;
  top: calc(var(--button-margin-top) / 2);
  box-shadow: 0rem 3px #b44800;
}

/* 存储按钮、源代码按钮的颜色 */
.color-button-purple
{
  background-color: #5c215b;
  box-shadow: 0px var(--button-border-size) hsl(301, 47%, 18%);
}

.color-button-purple:active
{
  position: relative;
  top: calc(var(--button-margin-top) / 2);
  box-shadow: 0px calc(var(--button-margin-top) / 6) hsl(301, 47%, 18%);
}

/* 加减关卡按钮的颜色 */
.color-button-6c96b6
{
  background-color: #6c96b6;
  box-shadow: 0rem var(--button-border-size) #3a5761;
}

.color-button-6c96b6:active
{
  position: relative;
  top: calc(var(--button-margin-top) / 2);
  box-shadow: 0px calc(var(--button-margin-top) / 6) #3a5761;
}

/* 显示等级按钮的颜色 */
.color-button-1f2d3a
{
  background-color: #1f2d3a;
  box-shadow: 0rem var(--button-border-size) #1a2023;
}

/* 设置按钮的颜色 */
.color-button-yeelow
{
  background-color: #e3bc21;
  box-shadow: 0px var(--button-border-size) #a87019;
}

.color-button-yeelow:active
{
  position: relative;
  top: calc(var(--button-margin-top) / 2);
  box-shadow: 0px calc(var(--button-margin-top) / 6) #a87019;
}

.color-button-empty
{
  background-color: #b5b1a5;
  position: relative;
  top: calc(var(--button-border-size) - calc(var(--button-margin-top) / 6));
  box-shadow: 0px calc(var(--button-margin-top) / 6) #cbc5b9, 0px calc(var(--button-margin-top) / 6 * -1) #cbc5b9;
}

.buttons-layout
{
  width: 100%;
  height: 100%;
  display: inline-grid;
  grid-template-columns: repeat(3, 33.33%);
  grid-template-rows: repeat(3, 33.33%);
  padding: 0;
}

.button
{
  width: var(--button-width);
  height: var(--button-height);
  border: none;
  font-size: 1.5rem;
  color: #e4decb;
  padding: 0;
  border-radius: var(--button-border-radius);
  margin-top: var(--button-margin-top);
  margin-left: var(--button-margin-left);
  margin-right: var(--button-margin-left);
}

@media screen and (max-width: 480px)
{
  #button-panel
  {
    --button-width: 29vw;
    --button-height: 12vh;
    --button-margin-top: 3vh;
    --button-margin-left: 1vw;
    --button-margin-right: 1vw;
    --button-border-size: 2vh;
  }
}
</style>
