import { expect, it, vi } from 'vitest'
import { mountButton, triggerInput } from '../helpers/component'

it('ordinary mouse, touch and keyboard clicks activate once; disabled buttons do nothing', async () => {
  const operation = vi.fn()
  const { wrapper, pointer } = mountButton({ operation })
  for (const pointerType of ['mouse', 'touch']) {
    await triggerInput(wrapper, 'pointerdown', pointer(1, { pointerType }))
    await triggerInput(wrapper, 'pointerup', pointer(1, { pointerType }))
    await triggerInput(wrapper, 'click', { detail: 1 })
  }
  await triggerInput(wrapper, 'click', { detail: 0 })
  expect(operation).toHaveBeenCalledTimes(3)
  await wrapper.setProps({ disabled: true })
  await triggerInput(wrapper, 'click', { detail: 1 })
  expect(operation).toHaveBeenCalledTimes(3)
})

it('press actions ignore duplicate/right-button input and synthetic click; keyboard activates once', async () => {
  const events = []
  const { wrapper, pointer } = mountButton({ onPressStart: () => events.push('start'), onPressEnd: () => events.push('end') })
  await triggerInput(wrapper, 'pointerdown', pointer(1, { button: 2 }))
  await triggerInput(wrapper, 'pointerdown', pointer())
  await triggerInput(wrapper, 'pointerdown', pointer(2))
  await triggerInput(wrapper, 'pointerup', pointer(2))
  await triggerInput(wrapper, 'pointerup', pointer())
  await triggerInput(wrapper, 'click', { detail: 1 })
  await triggerInput(wrapper, 'click', { detail: 0 })
  expect(events).toEqual(['start', 'end', 'start', 'end'])
})

it('dragging out, pointer cancellation, blur, disabling and unmount cancel active presses', async () => {
  const onPressEnd = vi.fn()
  const onPressCancel = vi.fn()
  const { wrapper, pointer } = mountButton({ onPressStart() {}, onPressEnd, onPressCancel })
  await triggerInput(wrapper, 'pointerdown', pointer())
  await triggerInput(wrapper, 'pointermove', pointer(1, { clientX: 200 }))
  await triggerInput(wrapper, 'pointerup', pointer())
  await triggerInput(wrapper, 'pointerdown', pointer())
  await triggerInput(wrapper, 'pointercancel')
  await triggerInput(wrapper, 'pointerdown', pointer())
  window.dispatchEvent(new Event('blur'))
  await triggerInput(wrapper, 'pointerdown', pointer())
  await wrapper.setProps({ disabled: true })
  await wrapper.setProps({ disabled: false })
  await triggerInput(wrapper, 'pointerdown', pointer())
  wrapper.unmount()
  expect(onPressEnd).not.toHaveBeenCalled()
  expect(onPressCancel).toHaveBeenCalledTimes(5)
})
