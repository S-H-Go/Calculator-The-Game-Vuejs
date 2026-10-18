import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import LedStyleCanvas from '../../src/components/screenSection/LedStyleCanvas.vue'

it('number blinking affects only lit segments while the LCD background and portal markers stay steady', async () => {
  const strokes = new WeakMap()
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function () {
    const drawn = []
    strokes.set(this, drawn)
    return {
      beginPath() {},
      moveTo() {},
      lineTo() {},
      stroke() { drawn.push(this.globalAlpha) },
    }
  })
  const wrapper = mount(LedStyleCanvas, { props: {
    ledOptions: { values: 12, width: 36, height: 60, lineWidth: 5, color: '#3b3c3a', italics: -8, opacity: 0.1 },
    portals: { entrance: 3, exit: 0 },
    numberBlink: true,
  } })
  const [background, foreground] = wrapper.findAll('canvas')
  const backgroundStrokes = strokes.get(background.element)
  const foregroundStrokes = strokes.get(foreground.element)
  expect(backgroundStrokes).toHaveLength(28)
  expect(backgroundStrokes.every(alpha => alpha === 0.1)).toBe(true)
  expect(foregroundStrokes.filter(alpha => alpha === 1)).toHaveLength(7)
  expect(foregroundStrokes.slice(0, 14).every(alpha => alpha === 0)).toBe(true)
  expect(foreground.classes()).toContain('blink')
  expect(background.classes()).not.toContain('blink')
  expect(wrapper.findAll('svg').every(marker => !marker.classes().includes('blink'))).toBe(true)
  await wrapper.setProps({ numberBlink: false })
  expect(foreground.classes()).not.toContain('blink')
  expect(backgroundStrokes).toHaveLength(28)
})
