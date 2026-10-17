<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import type { CSSProperties } from 'vue'
import type { IButtonInfo } from '../modules/interface'

const props = defineProps<IButtonInfo>()
const hasPressHandlers = computed(() => Boolean(props.onPressStart || props.onPressEnd || props.onPressCancel))
const buttonStyle = computed<CSSProperties>(() => ({
  gridColumn: props.x,
  gridRow: props.y,
  fontSize: props.fontSize,
  whiteSpace: props.text.includes('\n') ? 'pre-line' : undefined,
}))

let activePointer: number | undefined
let pressedElement: HTMLElement | undefined
let endPress: IButtonInfo['onPressEnd']
let cancelPress: IButtonInfo['onPressCancel']

function finishPress(cancelled = false) {
  if (activePointer === undefined)
    return

  const pointer = activePointer
  const element = pressedElement
  const handler = cancelled ? cancelPress : endPress
  activePointer = undefined
  pressedElement = undefined
  endPress = undefined
  cancelPress = undefined
  if (element?.hasPointerCapture(pointer))
    element.releasePointerCapture(pointer)
  handler?.()
}

function cancel() {
  finishPress(true)
}

function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    return
  }

  if (!hasPressHandlers.value) {
    props.operation?.()
  }
  else if (event.detail === 0) {
    // Native keyboard/assistive activation has no pointer press sequence.
    props.onPressStart?.()
    props.onPressEnd?.()
  }
}

function handlePointerDown(event: PointerEvent) {
  if (props.disabled || !hasPressHandlers.value || event.button !== 0 || activePointer !== undefined)
    return

  activePointer = event.pointerId
  pressedElement = event.currentTarget as HTMLElement
  endPress = props.onPressEnd
  cancelPress = props.onPressCancel
  pressedElement.setPointerCapture(event.pointerId)
  props.onPressStart?.()
}

function handlePointerMove(event: PointerEvent) {
  if (activePointer !== event.pointerId || !pressedElement)
    return

  const bounds = pressedElement.getBoundingClientRect()
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)
    cancel()
}

function handlePointerUp(event: PointerEvent) {
  if (activePointer === event.pointerId)
    finishPress()
}

watch(() => [props.disabled, props.onPressStart], cancel)
onMounted(() => window.addEventListener('blur', cancel))
onBeforeUnmount(() => {
  cancel()
  window.removeEventListener('blur', cancel)
})
</script>

<template>
  <component
    :is="props.href ? 'a' : 'button'"
    :type="props.href ? undefined : 'button'"
    :href="props.href"
    class="button" :class="[props.colorClass]"
    :disabled="props.disabled"
    :aria-disabled="props.disabled || undefined"
    :tabindex="props.disabled ? -1 : undefined"
    :style="buttonStyle"
    @click="handleClick"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointercancel="cancel"
    @lostpointercapture="cancel"
  >
    {{ props.text }}
  </component>
</template>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  touch-action: none;
  -webkit-touch-callout: none;
}

.button:focus-visible {
  outline: 3px solid #3d3c3a;
  outline-offset: 4px;
}
</style>
