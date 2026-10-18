import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import { nextTick } from 'vue'
import Button from '../../src/components/Button.vue'

export function mountButton(overrides = {}) {
  const wrapper = mount(Button, { props: { x: 1, y: 1, text: 'test', colorClass: 'test-color', ...overrides } })
  // jsdom has no pointer capture or layout, so model just these browser APIs.
  const captures = new Set()
  Object.assign(wrapper.element, {
    setPointerCapture: id => captures.add(id),
    hasPointerCapture: id => captures.has(id),
    releasePointerCapture: id => captures.delete(id),
  })
  vi.spyOn(wrapper.element, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, right: 100, bottom: 100 })
  const pointer = (pointerId = 1, extra = {}) => ({ pointerId, button: 0, clientX: 50, clientY: 50, ...extra })
  return { wrapper, pointer }
}

// Construct native events directly: VTU trigger assigns inherited read-only MouseEvent fields.
export async function triggerInput(wrapper, type, options = {}) {
  const EventType = type === 'click' ? MouseEvent : PointerEvent
  wrapper.element.dispatchEvent(new EventType(type, { bubbles: true, cancelable: true, ...options }))
  await nextTick()
}
