import { enableAutoUnmount } from '@vue/test-utils'
import { createPinia, disposePinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, vi } from 'vitest'

enableAutoUnmount(afterEach)

let pinia
beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(0)
  pinia = createPinia()
  setActivePinia(pinia)
})

afterEach(() => {
  disposePinia(pinia)
  vi.clearAllTimers()
  vi.restoreAllMocks()
  vi.useRealTimers()
  localStorage.clear()
})
