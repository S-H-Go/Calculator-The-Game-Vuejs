import { expect } from 'vitest'
import { useGameStore } from '../../src/stores/index'
import { useLevelStore } from '../../src/stores/level'

export function button(store, text) {
  const found = store.buttons.find(item => item.text === text)
  expect(found, `Missing button ${text}`).toBeTruthy()
  return found
}

export function init(overrides = {}) {
  const game = useGameStore()
  const level = useLevelStore()
  level.initLevel({ level: 1, initialNum: 12, initialStep: 8, goal: 999999, buttons: ['+1', 'Store'], path: [], ...overrides })
  return { game, level }
}
