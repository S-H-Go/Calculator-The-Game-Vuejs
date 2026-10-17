import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { after, afterEach, beforeEach, test } from 'node:test'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createPinia, setActivePinia } from 'pinia'
import ts from 'typescript'
import { createServer } from 'vite'
import { createRenderer, h, nextTick, reactive } from 'vue'
import { compileScript, parse } from 'vue/compiler-sfc'

// Exercise the actual stores and compiled SFC without adding a test framework.
const storage = new Map()
globalThis.localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: key => storage.delete(key),
}
globalThis.window = new EventTarget()
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const { useGameStore } = await server.ssrLoadModule('/src/stores/index.ts')
const { useLevelStore } = await server.ssrLoadModule('/src/stores/level.ts')
const { getButtonText } = await server.ssrLoadModule('/src/modules/operations.ts')
const levels = JSON.parse(await readFile(new URL('../src/assets/levelData.json', import.meta.url)))

const source = await readFile(new URL('../src/components/Button.vue', import.meta.url), 'utf8')
const { descriptor } = parse(source, { filename: fileURLToPath(new URL('../src/components/Button.vue', import.meta.url)).replaceAll('\\', '/') })
const script = compileScript(descriptor, {
  id: 'button-test',
  inlineTemplate: true,
  fs: { fileExists: ts.sys.fileExists, readFile: ts.sys.readFile },
})
const require = createRequire(import.meta.url)
const vueUrl = pathToFileURL(require.resolve('vue')).href
const compiled = ts.transpileModule(script.content, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText.replaceAll('from "vue"', `from '${vueUrl}'`).replaceAll('from \'vue\'', `from '${vueUrl}'`)
const { default: Button } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)

function element(type = 'root') {
  const captures = new Set()
  return {
    type,
    props: {},
    children: [],
    parent: null,
    text: '',
    setPointerCapture: id => captures.add(id),
    hasPointerCapture: id => captures.has(id),
    releasePointerCapture: id => captures.delete(id),
    getBoundingClientRect: () => ({ left: 0, top: 0, right: 100, bottom: 100 }),
  }
}
const renderer = createRenderer({
  createElement: element,
  createText: text => Object.assign(element('text'), { text }),
  createComment: text => Object.assign(element('comment'), { text }),
  setText: (node, text) => { node.text = text },
  setElementText: (node, text) => { node.text = text },
  patchProp: (node, key, _previous, value) => { node.props[key] = value },
  insert(node, parent) {
    if (node.parent)
      node.parent.children.splice(node.parent.children.indexOf(node), 1)
    node.parent = parent
    parent.children.push(node)
  },
  remove(node) {
    node.parent.children.splice(node.parent.children.indexOf(node), 1)
    node.parent = null
  },
  parentNode: node => node.parent,
  nextSibling: () => null,
})

const apps = []
let pinia
beforeEach(() => {
  storage.clear()
  pinia = createPinia()
  setActivePinia(pinia)
})
afterEach(() => {
  for (const app of apps.splice(0))
    app.unmount()
  for (const store of pinia._s.values())
    store.$dispose()
})
after(() => server.close())

function mountButton(overrides = {}) {
  const props = reactive({ x: 1, y: 1, text: 'test', colorClass: 'test-color', ...overrides })
  const root = element()
  const app = renderer.createApp({ render: () => h(Button, props) })
  apps.push(app)
  app.mount(root)
  const node = root.children[0]
  const pointer = (pointerId = 1, extra = {}) => ({ pointerId, button: 0, currentTarget: node, clientX: 50, clientY: 50, ...extra })
  return { props, node, pointer, app }
}

function button(store, text) {
  const found = store.buttons.find(item => item.text === text)
  assert.ok(found, `Missing button ${text}`)
  return found
}

function init(overrides = {}) {
  const game = useGameStore()
  const level = useLevelStore()
  level.initLevel({ level: 1, initialNum: 12, initialStep: 8, goal: 999999, buttons: ['+1', 'Store'], path: [], ...overrides })
  return { game, level }
}

test('ordinary mouse, touch and keyboard clicks activate once; disabled buttons do nothing', async () => {
  let clicks = 0
  const { node, pointer, props } = mountButton({ operation: () => clicks++ })
  for (const pointerType of ['mouse', 'touch']) {
    node.props.onPointerdown(pointer(1, { pointerType }))
    node.props.onPointerup(pointer(1, { pointerType }))
    node.props.onClick({ detail: 1 })
  }
  node.props.onClick({ detail: 0 })
  assert.equal(clicks, 3)
  props.disabled = true
  await nextTick()
  node.props.onClick({ detail: 1, preventDefault() {} })
  assert.equal(clicks, 3)
})

test('press actions ignore duplicate/right-button input and synthetic click; keyboard activates once', () => {
  const events = []
  const { node, pointer } = mountButton({ onPressStart: () => events.push('start'), onPressEnd: () => events.push('end') })
  node.props.onPointerdown(pointer(1, { button: 2 }))
  node.props.onPointerdown(pointer())
  node.props.onPointerdown(pointer(2))
  node.props.onPointerup(pointer(2))
  node.props.onPointerup(pointer())
  node.props.onClick({ detail: 1 })
  node.props.onClick({ detail: 0 })
  assert.deepEqual(events, ['start', 'end', 'start', 'end'])
})

test('dragging out, pointer cancellation, blur, disabling and unmount cancel active presses', async () => {
  let ends = 0
  let cancels = 0
  const { node, pointer, props, app } = mountButton({ onPressStart() {}, onPressEnd: () => ends++, onPressCancel: () => cancels++ })
  node.props.onPointerdown(pointer())
  node.props.onPointermove(pointer(1, { clientX: 200 }))
  node.props.onPointerup(pointer())
  node.props.onPointerdown(pointer())
  node.props.onPointercancel()
  node.props.onPointerdown(pointer())
  window.dispatchEvent(new Event('blur'))
  node.props.onPointerdown(pointer())
  props.disabled = true
  await nextTick()
  props.disabled = false
  await nextTick()
  node.props.onPointerdown(pointer())
  app.unmount()
  apps.splice(apps.indexOf(app), 1)
  assert.equal(ends, 0)
  assert.equal(cancels, 5)
})

test('Store long press updates its label, short press appends once, cancellation does not recall', async () => {
  const { level } = init()
  const mounted = mountButton(button(level, 'Store'))
  mounted.node.props.onPointerdown(mounted.pointer())
  await delay(550)
  Object.assign(mounted.props, button(level, '12'))
  await nextTick()
  mounted.node.props.onPointerup(mounted.pointer())
  assert.equal(level.screenInfo.currentNum, 12)
  assert.equal(level.screenInfo.currentStep, 7)
  button(level, '12').onPressStart()
  button(level, '12').onPressEnd()
  assert.equal(level.screenInfo.currentNum, 1212)
  assert.equal(level.screenInfo.currentStep, 6)
  button(level, '12').onPressStart()
  button(level, '12').onPressCancel()
  await delay(550)
  assert.equal(level.screenInfo.currentStep, 6)
  button(level, 'CLR').operation()
  assert.ok(button(level, 'Store'))
})

test('holding level selection repeats across reinitialization and stops on release', async () => {
  const { game, level } = init()
  game.toggleMode()
  const layout = level.buttons.map(({ x, y, text }) => `${x},${y}:${text}`)
  assert.deepEqual(layout, [
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
  assert.equal(button(level, '原游戏').href, 'https://www.taptap.com/app/56200')
  const mounted = mountButton(button(level, '+'))
  mounted.node.props.onPointerdown(mounted.pointer())
  await delay(850)
  Object.assign(mounted.props, button(level, '+'))
  await nextTick()
  assert.ok(game.currentLevel >= 3)
  assert.equal(game.control.showWhat, 'pause')
  assert.equal(game.control.pauseBlink, true)
  mounted.node.props.onPointerup(mounted.pointer())
  const stoppedAt = game.currentLevel
  await delay(300)
  assert.equal(game.currentLevel, stoppedAt)
  button(level, '设置').operation()
  assert.equal(game.control.showWhat, 'number')
  assert.equal(level.screenInfo.level, game.currentLevel)
})

function useFakeClock(context) {
  let now = 0
  let nextId = 0
  const timers = new Map()
  context.mock.method(Date, 'now', () => now)
  context.mock.method(globalThis, 'setTimeout', (callback, timeout) => {
    const id = ++nextId
    timers.set(id, { at: now + timeout, callback })
    return id
  })
  context.mock.method(globalThis, 'clearTimeout', id => timers.delete(id))
  return (milliseconds) => {
    const target = now + milliseconds
    for (;;) {
      const next = [...timers.entries()].sort((a, b) => a[1].at - b[1].at)[0]
      if (!next || next[1].at > target)
        break
      now = next[1].at
      timers.delete(next[0])
      next[1].callback()
    }
    now = target
  }
}

for (const direction of ['+', '-']) {
  test(`holding ${direction} accelerates, stops on release and restarts slowly`, (context) => {
    const advance = useFakeClock(context)
    const { game, level } = init()
    game.toggleMode()
    let calls = 0
    const method = direction === '+' ? 'levelIncrease' : 'levelReduction'
    const original = game[method]
    context.mock.method(game, method, () => {
      calls++
      original()
    })
    const held = button(level, direction)
    held.onPressStart()
    assert.equal(calls, 1)
    advance(399)
    assert.equal(calls, 1)
    advance(601)
    const firstSecond = calls
    advance(1000)
    const secondSecond = calls - firstSecond
    advance(1000)
    const thirdSecond = calls - firstSecond - secondSecond
    assert.ok(secondSecond > firstSecond)
    assert.ok(thirdSecond > secondSecond)
    advance(3000)
    const beforeMaximum = calls
    advance(1000)
    assert.equal(calls - beforeMaximum, 25)
    held.onPressEnd()
    const stopped = calls
    advance(1000)
    assert.equal(calls, stopped)
    held.onPressStart()
    advance(399)
    assert.equal(calls, stopped + 1)
    held.onPressCancel()
    advance(1000)
    assert.equal(calls, stopped + 1)
  })
}

test('opposite direction, leaving settings and disposal stop pending repeats', (context) => {
  const advance = useFakeClock(context)
  const { game, level } = init()
  game.toggleMode()
  button(level, '+').onPressStart()
  button(level, '-').onPressStart()
  advance(1000)
  assert.ok(game.currentLevel > 190, 'Only the decreasing direction should remain active')
  game.toggleMode()
  const exitedAt = game.currentLevel
  advance(1000)
  assert.equal(game.currentLevel, exitedAt)
  game.toggleMode()
  button(level, '+').onPressStart()
  level.$dispose()
  const disposedAt = game.currentLevel
  advance(1000)
  assert.equal(game.currentLevel, disposedAt)
})

test('Each rebuilds arithmetic and insert buttons reactively; CLR restores originals', () => {
  const { level } = init({ initialNum: 0, buttons: ['each+1', 'insert1', '+2'] })
  button(level, '[+]1').operation()
  assert.ok(button(level, '2'))
  button(level, '+ 3').operation()
  button(level, '2').operation()
  assert.equal(level.screenInfo.currentNum, 32)
  button(level, 'CLR').operation()
  assert.ok(button(level, '1'))
  assert.ok(button(level, '+ 2'))
  assert.equal(level.screenInfo.currentNum, 0)
})

test('win locks operations, replaces CLR with OK, and advances through dialogue', async () => {
  const { game, level } = init({ initialNum: 0, goal: 1, buttons: ['+1'], dialogue: [{ info: '完成！', buttons: [{ info: '继续', position: 4 }] }] })
  button(level, '+ 1').operation()
  assert.equal(button(level, '+ 1').disabled, true)
  await delay(950)
  assert.equal(game.control.showWhat, 'accomplish')
  button(level, 'OK').operation()
  assert.equal(game.control.showWhat, 'conversation')
  button(level, '继续').operation()
  assert.equal(game.currentLevel, 1)
  assert.equal(game.control.showWhat, 'number')
})

test('resetting or entering settings during win blink prevents stale completion', async () => {
  const { game, level } = init({ initialNum: 0, goal: 1, buttons: ['+1'] })
  button(level, '+ 1').operation()
  button(level, 'CLR').operation()
  await delay(950)
  assert.equal(game.control.showWhat, 'number')
  assert.equal(level.screenInfo.currentNum, 0)
  button(level, '+ 1').operation()
  game.toggleMode()
  await delay(950)
  assert.equal(game.control.showWhat, 'pause')
  assert.equal(game.control.pauseBlink, true)
})

test('invalid arithmetic shows ERROR, blocks further operations, and CLR recovers', () => {
  const { game, level } = init({ initialNum: 1, buttons: ['/2', '+1'] })
  button(level, '/ 2').operation()
  assert.equal(game.control.showWhat, 'error')
  assert.equal(button(level, '+ 1').disabled, true)
  assert.equal(level.screenInfo.currentStep, 8)
  button(level, 'CLR').operation()
  assert.equal(game.control.showWhat, 'number')
  assert.equal(button(level, '+ 1').disabled, false)
})

test('tutorial replies, restart branch and operation previews use generic button descriptors', () => {
  const game = useGameStore()
  game.init()
  const level = useLevelStore()
  assert.equal(level.buttons.length, 9)
  button(level, '嗨!').operation()
  assert.equal(level.screenInfo.dialogueIndex, 1)
  level.initLevel({ ...levels[0], dialogue: [{ info: '测试', buttons: [{ info: 'Store2', position: 1 }, { info: '不明白', position: 4 }] }, ...levels[0].dialogue] })
  assert.equal(button(level, '2').disabled, true)
  assert.equal(button(level, '2').colorClass, 'color-button-purple')
  button(level, '不明白').operation()
  assert.equal(level.screenInfo.dialogueIndex, 2)
})

test('representative configured solution paths complete across operation families', async () => {
  const { game, level } = init()
  game.blink = async () => {}
  // Excludes the explicitly unimplemented portals and Store hold notation.
  for (const index of [1, 3, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 132, 133, 137, 140]) {
    const data = levels[index]
    level.initLevel(data)
    for (const token of data.path) {
      const action = button(level, getButtonText(token))
      assert.equal(Boolean(action.disabled), false, `Disabled ${token} in level ${index}`)
      action.operation()
      await Promise.resolve()
    }
    assert.equal(level.screenInfo.currentNum, data.goal, `Wrong result in level ${index}`)
    assert.equal(game.control.showWhat, 'accomplish', `Not completed: ${index}`)
  }
})
