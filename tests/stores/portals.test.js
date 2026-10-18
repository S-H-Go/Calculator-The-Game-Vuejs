import { expect, it, vi } from 'vitest'
import levels from '../../src/assets/levelData.json'
import { getButtonText } from '../../src/modules/operations'
import { button, init } from '../helpers/game'

it('portals run before goal and display-limit checks and consume only the button step', async () => {
  const { game, level } = init({ initialNum: 99999, initialStep: 1, goal: 936, buttons: ['x100'], portals: { entrance: 3, exit: 0 } })
  vi.spyOn(game, 'blink').mockResolvedValue(undefined)
  button(level, 'x 100').operation()
  await vi.advanceTimersByTimeAsync(0)
  expect(level.screenInfo.currentNum).toBe(936)
  expect(level.screenInfo.currentStep).toBe(0)
  expect(game.control.showWhat).toBe('accomplish')
  level.initLevel(levels[180])
  button(level, '1').operation()
  await vi.advanceTimersByTimeAsync(0)
  expect(level.screenInfo.currentNum).toBe(1)
  button(level, 'CLR').operation()
  expect(level.screenInfo.currentNum).toBe(99)
  expect(level.screenInfo.currentStep).toBe(3)
  expect(level.screenInfo.portals).toEqual({ entrance: 2, exit: 0 })
  level.initLevel(levels[1])
  expect(level.screenInfo.portals).toBe(undefined)
  button(level, '+ 1').operation()
  expect(level.screenInfo.currentNum).toBe(1)
})

for (const data of levels.filter(level => level.portals)) {
  it(`portal level ${data.level} completes with its configured solution`, async () => {
    const { game, level } = init(data)
    vi.spyOn(game, 'blink').mockResolvedValue(undefined)
    for (const token of data.path) {
      if (token === 'Store' || token === 'TakeOut') {
        const store = level.buttons.find(item => item.colorClass === 'color-button-purple')
        expect(store).toBeTruthy()
        store.onPressStart()
        if (token === 'Store')
          vi.advanceTimersByTime(500)
        store.onPressEnd()
      }
      else {
        const action = button(level, getButtonText(token))
        expect(Boolean(action.disabled), `Disabled ${token} in level ${data.level}`).toBe(false)
        action.operation()
      }
      await vi.advanceTimersByTimeAsync(0)
    }
    expect(level.screenInfo.currentNum).toBe(data.goal)
    expect(game.control.showWhat).toBe('accomplish')
    expect(level.screenInfo.currentStep).toBe(data.initialStep - data.path.length)
  })
}

it('portal entrance and exit blink for the same duration as CLR around every transfer', async () => {
  const { game, level } = init(levels[180])
  button(level, 'CLR').operation()
  vi.advanceTimersByTime(899)
  await vi.advanceTimersByTimeAsync(0)
  expect(game.control.numberBlink).toBe(true)
  vi.advanceTimersByTime(1)
  await vi.advanceTimersByTimeAsync(0)
  expect(game.control.numberBlink).toBe(false)

  const insert = button(level, '1')
  insert.operation()
  expect(level.screenInfo.currentNum).toBe(991)
  expect(level.screenInfo.currentStep).toBe(2)
  expect(level.portalAnimating).toBe(true)
  expect(game.control.portalEntranceBlink).toBe(true)
  expect(game.control.portalExitBlink).toBe(false)
  expect(button(level, '1').disabled).toBe(true)
  insert.operation()
  expect(level.screenInfo.currentStep).toBe(2)

  vi.advanceTimersByTime(899)
  await vi.advanceTimersByTimeAsync(0)
  expect(level.screenInfo.currentNum).toBe(991)
  vi.advanceTimersByTime(1)
  await vi.advanceTimersByTimeAsync(0)
  expect(level.screenInfo.currentNum).toBe(100)
  expect(game.control.portalEntranceBlink).toBe(false)
  expect(game.control.portalExitBlink).toBe(true)

  vi.advanceTimersByTime(899)
  await vi.advanceTimersByTimeAsync(0)
  expect(game.control.portalExitBlink).toBe(true)
  vi.advanceTimersByTime(1)
  await vi.advanceTimersByTimeAsync(0)
  expect(level.screenInfo.currentNum).toBe(100)
  expect(game.control.portalExitBlink).toBe(false)
  expect(game.control.portalEntranceBlink).toBe(true)

  vi.advanceTimersByTime(900)
  await vi.advanceTimersByTimeAsync(0)
  expect(level.screenInfo.currentNum).toBe(1)
  expect(game.control.portalExitBlink).toBe(true)
  expect(level.portalAnimating).toBe(true)
  vi.advanceTimersByTime(900)
  await vi.advanceTimersByTimeAsync(0)
  expect(level.portalAnimating).toBe(false)
  expect(game.control.portalExitBlink).toBe(false)
  expect(level.screenInfo.currentStep).toBe(2)
  expect(button(level, '1').disabled).toBe(false)
})

it('portal animations wait until the entrance position contains a digit', () => {
  const { game, level } = init(levels[181])
  button(level, '6').operation()
  expect(level.screenInfo.currentNum).toBe(96)
  expect(level.portalAnimating).toBe(false)
  expect(game.control.portalEntranceBlink).toBe(false)
  expect(game.control.portalExitBlink).toBe(false)
})

it('portal goals are checked after the exit blink completes, even on the last step', async () => {
  const { game, level } = init({ initialNum: 100, initialStep: 1, goal: 1, buttons: ['insert0'], portals: { entrance: 3, exit: 0 } })
  button(level, '0').operation()
  vi.advanceTimersByTime(900)
  await vi.advanceTimersByTimeAsync(0)
  expect(level.screenInfo.currentNum).toBe(1)
  expect(level.screenInfo.currentStep).toBe(0)
  expect(game.control.showWhat).toBe('number')
  expect(game.control.numberBlink).toBe(false)
  expect(game.control.portalExitBlink).toBe(true)
  vi.advanceTimersByTime(900)
  await vi.advanceTimersByTimeAsync(0)
  expect(level.portalAnimating).toBe(false)
  expect(game.control.portalExitBlink).toBe(false)
  expect(game.control.numberBlink).toBe(true)
  expect(game.control.showWhat).toBe('number')
  vi.advanceTimersByTime(900)
  await vi.advanceTimersByTimeAsync(0)
  expect(game.control.showWhat).toBe('accomplish')
  expect(button(level, 'OK')).toBeTruthy()
})

for (const phase of ['entrance', 'exit']) {
  for (const cancellation of ['CLR', 'settings', 'level', 'dispose']) {
    it(`${cancellation} cancels portal animation during ${phase} blink`, async () => {
      const { game, level } = init(levels[180])
      button(level, '1').operation()
      if (phase === 'exit') {
        vi.advanceTimersByTime(900)
        await vi.advanceTimersByTimeAsync(0)
        expect(game.control.portalExitBlink).toBe(true)
      }
      if (cancellation === 'CLR')
        button(level, 'CLR').operation()
      else if (cancellation === 'settings')
        game.toggleMode()
      else if (cancellation === 'level')
        game.levelIncrease()
      else
        level.$dispose()

      const number = level.screenInfo.currentNum
      const steps = level.screenInfo.currentStep
      expect(level.portalAnimating).toBe(false)
      if (cancellation !== 'dispose') {
        expect(game.control.portalEntranceBlink).toBe(false)
        expect(game.control.portalExitBlink).toBe(false)
      }
      vi.advanceTimersByTime(5000)
      await vi.advanceTimersByTimeAsync(0)
      expect(level.screenInfo.currentNum).toBe(number)
      expect(level.screenInfo.currentStep).toBe(steps)
      expect(level.portalAnimating).toBe(false)
    })
  }
}

it('a cancelled portal animation cannot clear the next animation state', async () => {
  const { game, level } = init(levels[180])
  button(level, '1').operation()
  button(level, 'CLR').operation()
  button(level, '1').operation()
  expect(game.control.numberBlink).toBe(false)
  vi.advanceTimersByTime(900)
  await vi.advanceTimersByTimeAsync(0)
  expect(level.screenInfo.currentNum).toBe(100)
  expect(level.portalAnimating).toBe(true)
  expect(game.control.portalEntranceBlink).toBe(false)
  expect(game.control.portalExitBlink).toBe(true)
})
