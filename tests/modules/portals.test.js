import { expect, it } from 'vitest'
import { applyPortals } from '../../src/modules/portals'

it('portals count digits from the right, add at the exit and resolve cascading carries', () => {
  expect(applyPortals(991, { entrance: 2, exit: 0 })).toBe(1)
  expect(applyPortals(964, { entrance: 2, exit: 1 })).toBe(64)
  expect(applyPortals(12345, { entrance: 3, exit: 0 })).toBe(348)
  expect(applyPortals(-991, { entrance: 2, exit: 0 })).toBe(-1)
  expect(applyPortals(1000, { entrance: 3, exit: 1 })).toBe(10)
  expect(applyPortals(99, { entrance: 2, exit: 0 })).toBe(99)
  expect(applyPortals(0, { entrance: 2, exit: 0 })).toBe(0)
  expect(applyPortals(123)).toBe(123)
  expect(applyPortals(1.5, { entrance: 2, exit: 0 })).toBe(1.5)
  expect(Number.isNaN(applyPortals(123, { entrance: 1, exit: 2 }))).toBeTruthy()
})
