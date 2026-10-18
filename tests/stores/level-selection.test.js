import { expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mountButton, triggerInput } from '../helpers/component'
import { button, init } from '../helpers/game'

it('holding level selection repeats across reinitialization and stops on release', async () => {
  const { game, level } = init()
  game.toggleMode()
  const layout = level.buttons.map(({ x, y, text }) => `${x},${y}:${text}`)
  expect(layout).toEqual([
    '1,1:该游戏非原创',
    '2,1:原游戏',
    '3,1:',
    '1,2:-',
    '2,2:等级\n1',
    '3,2:+',
    '1,3:设置',
    '2,3:源代码',
    '3,3:',
  ])
  expect(button(level, '原游戏').href).toBe('https://www.taptap.com/app/56200')
  const mounted = mountButton(button(level, '+'))
  await triggerInput(mounted.wrapper, 'pointerdown', mounted.pointer())
  await vi.advanceTimersByTimeAsync(850)
  await mounted.wrapper.setProps(button(level, '+'))
  await nextTick()
  expect(game.currentLevel >= 3).toBeTruthy()
  expect(game.control.showWhat).toBe('pause')
  expect(game.control.pauseBlink).toBe(true)
  await triggerInput(mounted.wrapper, 'pointerup', mounted.pointer())
  const stoppedAt = game.currentLevel
  await vi.advanceTimersByTimeAsync(300)
  expect(game.currentLevel).toBe(stoppedAt)
  button(level, '设置').operation()
  expect(game.control.showWhat).toBe('number')
  expect(level.screenInfo.level).toBe(game.currentLevel)
})

for (const direction of ['+', '-']) {
  it(`holding ${direction} accelerates, stops on release and restarts slowly`, () => {
    const { game, level } = init()
    game.toggleMode()
    let calls = 0
    const method = direction === '+' ? 'levelIncrease' : 'levelReduction'
    const original = game[method]
    vi.spyOn(game, method).mockImplementation(() => {
      calls++
      original()
    })
    const held = button(level, direction)
    held.onPressStart()
    expect(calls).toBe(1)
    vi.advanceTimersByTime(399)
    expect(calls).toBe(1)
    vi.advanceTimersByTime(601)
    const firstSecond = calls
    vi.advanceTimersByTime(1000)
    const secondSecond = calls - firstSecond
    vi.advanceTimersByTime(1000)
    const thirdSecond = calls - firstSecond - secondSecond
    expect(secondSecond > firstSecond).toBeTruthy()
    expect(thirdSecond > secondSecond).toBeTruthy()
    vi.advanceTimersByTime(3000)
    const beforeMaximum = calls
    vi.advanceTimersByTime(1000)
    expect(calls - beforeMaximum).toBe(25)
    held.onPressEnd()
    const stopped = calls
    vi.advanceTimersByTime(1000)
    expect(calls).toBe(stopped)
    held.onPressStart()
    vi.advanceTimersByTime(399)
    expect(calls).toBe(stopped + 1)
    held.onPressCancel()
    vi.advanceTimersByTime(1000)
    expect(calls).toBe(stopped + 1)
  })
}

it('opposite direction, leaving settings and disposal stop pending repeats', () => {
  const { game, level } = init()
  game.toggleMode()
  button(level, '+').onPressStart()
  button(level, '-').onPressStart()
  vi.advanceTimersByTime(1000)
  expect(game.currentLevel > 190, 'Only the decreasing direction should remain active').toBeTruthy()
  game.toggleMode()
  const exitedAt = game.currentLevel
  vi.advanceTimersByTime(1000)
  expect(game.currentLevel).toBe(exitedAt)
  game.toggleMode()
  button(level, '+').onPressStart()
  level.$dispose()
  const disposedAt = game.currentLevel
  vi.advanceTimersByTime(1000)
  expect(game.currentLevel).toBe(disposedAt)
})
