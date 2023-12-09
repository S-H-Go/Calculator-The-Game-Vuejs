<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from '../../store'

const store = useStore()
const buttonData = computed(() => store.getButtonData)
</script>

<template>
  <div class="buttons-layout">
    <template v-for="buttonList of store.buttons">
      <component
        :is="item.tag" v-for="item of buttonList" :key="item.id" :current-num="buttonData.currentNum"
        :step="buttonData.step" :operation="item.operation" :num1="item.num1" :num2="item.num2"
        :info="item.info"
      />
    </template>
  </div>
</template>

<style>
</style>
