import { expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import levels from '../../src/assets/levelData.json'
import { getButtonText } from '../../src/modules/operations'
import { useGameStore } from '../../src/stores/index'
import { useLevelStore } from '../../src/stores/level'
import { mountButton, triggerInput } from '../helpers/component'
import { button, init } from '../helpers/game'

it('store long press updates its label, short press appends once, cancellation does not recall', async () => {
  const { level } = init()
  const mounted = mountButton(button(level, 'Store'))
  await triggerInput(mounted.wrapper, 'pointerdown', mounted.pointer())
  await vi.advanceTimersByTimeAsync(550)
  await mounted.wrapper.setProps(button(level, '12'))
  await nextTick()
  await triggerInput(mounted.wrapper, 'pointerup', mounted.pointer())
  expect(level.screenInfo.currentNum).toBe(12)
  expect(level.screenInfo.currentStep).toBe(7)
  button(level, '12').onPressStart()
  button(level, '12').onPressEnd()
  expect(level.screenInfo.currentNum).toBe(1212)
  expect(level.screenInfo.currentStep).toBe(6)
  button(level, '12').onPressStart()
  button(level, '12').onPressCancel()
  await vi.advanceTimersByTimeAsync(550)
  expect(level.screenInfo.currentStep).toBe(6)
  button(level, 'CLR').operation()
  expect(button(level, 'Store')).toBeTruthy()
})

it('each rebuilds arithmetic and insert buttons reactively; CLR restores originals', () => {
  const { level } = init({ initialNum: 0, buttons: ['each+1', 'insert1', '+2'] })
  button(level, '[+]1').operation()
  expect(button(level, '2')).toBeTruthy()
  button(level, '+ 3').operation()
  button(level, '2').operation()
  expect(level.screenInfo.currentNum).toBe(32)
  button(level, 'CLR').operation()
  expect(button(level, '1')).toBeTruthy()
  expect(button(level, '+ 2')).toBeTruthy()
  expect(level.screenInfo.currentNum).toBe(0)
})

it('win locks operations, replaces CLR with OK, and advances through dialogue', async () => {
  const { game, level } = init({ initialNum: 0, goal: 1, buttons: ['+1'], dialogue: [{ info: '完成！', buttons: [{ info: '继续', position: 4 }] }] })
  button(level, '+ 1').operation()
  expect(button(level, '+ 1').disabled).toBe(true)
  await vi.advanceTimersByTimeAsync(950)
  expect(game.control.showWhat).toBe('accomplish')
  button(level, 'OK').operation()
  expect(game.control.showWhat).toBe('conversation')
  button(level, '继续').operation()
  expect(game.currentLevel).toBe(1)
  expect(game.control.showWhat).toBe('number')
})

it('resetting or entering settings during win blink prevents stale completion', async () => {
  const { game, level } = init({ initialNum: 0, goal: 1, buttons: ['+1'] })
  button(level, '+ 1').operation()
  button(level, 'CLR').operation()
  await vi.advanceTimersByTimeAsync(950)
  expect(game.control.showWhat).toBe('number')
  expect(level.screenInfo.currentNum).toBe(0)
  button(level, '+ 1').operation()
  game.toggleMode()
  await vi.advanceTimersByTimeAsync(950)
  expect(game.control.showWhat).toBe('pause')
  expect(game.control.pauseBlink).toBe(true)
})

it('invalid arithmetic shows ERROR, blocks further operations, and CLR recovers', () => {
  const { game, level } = init({ initialNum: 1, buttons: ['/2', '+1'] })
  button(level, '/ 2').operation()
  expect(game.control.showWhat).toBe('error')
  expect(button(level, '+ 1').disabled).toBe(true)
  expect(level.screenInfo.currentStep).toBe(8)
  button(level, 'CLR').operation()
  expect(game.control.showWhat).toBe('number')
  expect(button(level, '+ 1').disabled).toBe(false)
})

it('tutorial replies, restart branch and operation previews use generic button descriptors', () => {
  const game = useGameStore()
  game.init()
  const level = useLevelStore()
  expect(level.buttons.length).toBe(9)
  button(level, '嗨!').operation()
  expect(level.screenInfo.dialogueIndex).toBe(1)
  level.initLevel({ ...levels[0], dialogue: [{ info: '测试', buttons: [{ info: 'Store2', position: 1 }, { info: '不明白', position: 4 }] }, ...levels[0].dialogue] })
  expect(button(level, '2').disabled).toBe(true)
  expect(button(level, '2').colorClass).toBe('color-button-purple')
  button(level, '不明白').operation()
  expect(level.screenInfo.dialogueIndex).toBe(2)
})

it('representative configured solution paths complete across operation families', async () => {
  const { game, level } = init()
  vi.spyOn(game, 'blink').mockResolvedValue(undefined)
  // Portal levels and Store hold notation are covered in separate test files.
  for (const index of [1, 3, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 132, 133, 137, 140]) {
    const data = levels[index]
    level.initLevel(data)
    for (const token of data.path) {
      const action = button(level, getButtonText(token))
      expect(Boolean(action.disabled), `Disabled ${token} in level ${index}`).toBe(false)
      action.operation()
      await Promise.resolve()
    }
    expect(level.screenInfo.currentNum, `Wrong result in level ${index}`).toBe(data.goal)
    expect(game.control.showWhat, `Not completed: ${index}`).toBe('accomplish')
  }
})
