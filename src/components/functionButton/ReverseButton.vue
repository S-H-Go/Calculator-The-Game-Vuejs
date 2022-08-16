<template>
  <button @click="reverse" class="button color-button-orange">Reverse</button>
</template>

<script lang="ts" setup>
import { useStore } from '../../store'
const store = useStore()
const props = defineProps<{
  currentNum: number,
  step: number,
}>()
function reverse() {
  //分解成数组，逆转数组再合成字符串
  if (props.step > 0 && props.currentNum != 0) {
    let numStr = props.currentNum.toString();
    if (numStr.includes("-")) {
      store.changeCurrentNum(
        Number(
          "-" +
          numStr
            .replace("-", "")
            .split("")
            .reverse()
            .join("")
        )
      );
    } else {
      store.changeCurrentNum(Number(numStr.split("").reverse().join("")));
    }
  }
}
</script>

<style>
</style>