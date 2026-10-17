import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { after, afterEach, beforeEach, test } from 'node:test'
import { setTimeout as delay, setImmediate as settle } from 'node:timers/promises'
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
const { applyPortals } = await server.ssrLoadModule('/src/modules/portals.ts')
const levels = JSON.parse(await readFile(new URL('../src/assets/levelData.json', import.meta.url)))

const require = createRequire(import.meta.url)
const vueUrl = pathToFileURL(require.resolve('vue')).href
async function loadComponent(relativePath) {
  const url = new URL(relativePath, import.meta.url)
  const source = await readFile(url, 'utf8')
  const { descriptor } = parse(source, { filename: fileURLToPath(url).replaceAll('\\', '/') })
  const script = compileScript(descriptor, {
    id: relativePath,
    inlineTemplate: true,
    fs: { fileExists: ts.sys.fileExists, readFile: ts.sys.readFile },
  })
  const compiled = ts.transpileModule(script.content, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText.replaceAll('from "vue"', `from '${vueUrl}'`).replaceAll('from \'vue\'', `from '${vueUrl}'`)
  return (await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)).default
}
const Button = await loadComponent('../src/components/Button.vue')
const LedStyleCanvas = await loadComponent('../src/components/screenSection/LedStyleCanvas.vue')

function element(type = 'root') {
  const captures = new Set()
  const strokes = []
  const context = {
    beginPath() {},
    moveTo() {},
    lineTo() {},
    stroke() {
      strokes.push(this.globalAlpha)
    },
  }
  return {
    style: {},
    strokes,
    getContext: () => context,
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
  insert(node, parent, anchor = null) {
    if (node.parent)
      node.parent.children.splice(node.parent.children.indexOf(node), 1)
    node.parent = parent
    const index = anchor ? parent.children.indexOf(anchor) : -1
    if (index < 0)
      parent.children.push(node)
    else
      parent.children.splice(index, 0, node)
  },
  remove(node) {
    node.parent.children.splice(node.parent.children.indexOf(node), 1)
    node.parent = null
  },
  parentNode: node => node.parent,
  nextSibling: node => node.parent?.children[node.parent.children.indexOf(node) + 1] ?? null,
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
  // Portal levels and Store hold notation are covered separately below.
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

test('portals count digits from the right, add at the exit and resolve cascading carries', () => {
  assert.equal(applyPortals(991, { entrance: 2, exit: 0 }), 1)
  assert.equal(applyPortals(964, { entrance: 2, exit: 1 }), 64)
  assert.equal(applyPortals(12345, { entrance: 3, exit: 0 }), 348)
  assert.equal(applyPortals(-991, { entrance: 2, exit: 0 }), -1)
  assert.equal(applyPortals(1000, { entrance: 3, exit: 1 }), 10)
  assert.equal(applyPortals(99, { entrance: 2, exit: 0 }), 99)
  assert.equal(applyPortals(0, { entrance: 2, exit: 0 }), 0)
  assert.equal(applyPortals(123), 123)
  assert.equal(applyPortals(1.5, { entrance: 2, exit: 0 }), 1.5)
  assert.ok(Number.isNaN(applyPortals(123, { entrance: 1, exit: 2 })))
})

test('portals run before goal and display-limit checks and consume only the button step', async () => {
  const { game, level } = init({ initialNum: 99999, initialStep: 1, goal: 936, buttons: ['x100'], portals: { entrance: 3, exit: 0 } })
  game.blink = async () => {}
  button(level, 'x 100').operation()
  await settle()
  assert.equal(level.screenInfo.currentNum, 936)
  assert.equal(level.screenInfo.currentStep, 0)
  assert.equal(game.control.showWhat, 'accomplish')
  level.initLevel(levels[180])
  button(level, '1').operation()
  await settle()
  assert.equal(level.screenInfo.currentNum, 1)
  button(level, 'CLR').operation()
  assert.equal(level.screenInfo.currentNum, 99)
  assert.equal(level.screenInfo.currentStep, 3)
  assert.deepEqual(level.screenInfo.portals, { entrance: 2, exit: 0 })
  level.initLevel(levels[1])
  assert.equal(level.screenInfo.portals, undefined)
  button(level, '+ 1').operation()
  assert.equal(level.screenInfo.currentNum, 1)
})

for (const data of levels.filter(level => level.portals)) {
  test(`portal level ${data.level} completes with its configured solution`, async (context) => {
    const advance = useFakeClock(context)
    const { game, level } = init(data)
    game.blink = async () => {}
    for (const token of data.path) {
      if (token === 'Store' || token === 'TakeOut') {
        const store = level.buttons.find(item => item.colorClass === 'color-button-purple')
        assert.ok(store)
        store.onPressStart()
        if (token === 'Store')
          advance(500)
        store.onPressEnd()
      }
      else {
        const action = button(level, getButtonText(token))
        assert.equal(Boolean(action.disabled), false, `Disabled ${token} in level ${data.level}`)
        action.operation()
      }
      await settle()
    }
    assert.equal(level.screenInfo.currentNum, data.goal)
    assert.equal(game.control.showWhat, 'accomplish')
    assert.equal(level.screenInfo.currentStep, data.initialStep - data.path.length)
  })
}

test('portal entrance and exit blink for the same duration as CLR around every transfer', async (context) => {
  const advance = useFakeClock(context)
  const { game, level } = init(levels[180])
  button(level, 'CLR').operation()
  advance(899)
  await settle()
  assert.equal(game.control.numberBlink, true)
  advance(1)
  await settle()
  assert.equal(game.control.numberBlink, false)

  const insert = button(level, '1')
  insert.operation()
  assert.equal(level.screenInfo.currentNum, 991)
  assert.equal(level.screenInfo.currentStep, 2)
  assert.equal(level.portalAnimating, true)
  assert.equal(game.control.portalEntranceBlink, true)
  assert.equal(game.control.portalExitBlink, false)
  assert.equal(button(level, '1').disabled, true)
  insert.operation()
  assert.equal(level.screenInfo.currentStep, 2)

  advance(899)
  await settle()
  assert.equal(level.screenInfo.currentNum, 991)
  advance(1)
  await settle()
  assert.equal(level.screenInfo.currentNum, 100)
  assert.equal(game.control.portalEntranceBlink, false)
  assert.equal(game.control.portalExitBlink, true)

  advance(899)
  await settle()
  assert.equal(game.control.portalExitBlink, true)
  advance(1)
  await settle()
  assert.equal(level.screenInfo.currentNum, 100)
  assert.equal(game.control.portalExitBlink, false)
  assert.equal(game.control.portalEntranceBlink, true)

  advance(900)
  await settle()
  assert.equal(level.screenInfo.currentNum, 1)
  assert.equal(game.control.portalExitBlink, true)
  assert.equal(level.portalAnimating, true)
  advance(900)
  await settle()
  assert.equal(level.portalAnimating, false)
  assert.equal(game.control.portalExitBlink, false)
  assert.equal(level.screenInfo.currentStep, 2)
  assert.equal(button(level, '1').disabled, false)
})

test('portal animations wait until the entrance position contains a digit', () => {
  const { game, level } = init(levels[181])
  button(level, '6').operation()
  assert.equal(level.screenInfo.currentNum, 96)
  assert.equal(level.portalAnimating, false)
  assert.equal(game.control.portalEntranceBlink, false)
  assert.equal(game.control.portalExitBlink, false)
})

test('portal goals are checked after the exit blink completes, even on the last step', async (context) => {
  const advance = useFakeClock(context)
  const { game, level } = init({ initialNum: 100, initialStep: 1, goal: 1, buttons: ['insert0'], portals: { entrance: 3, exit: 0 } })
  button(level, '0').operation()
  advance(900)
  await settle()
  assert.equal(level.screenInfo.currentNum, 1)
  assert.equal(level.screenInfo.currentStep, 0)
  assert.equal(game.control.showWhat, 'number')
  assert.equal(game.control.numberBlink, false)
  assert.equal(game.control.portalExitBlink, true)
  advance(900)
  await settle()
  assert.equal(level.portalAnimating, false)
  assert.equal(game.control.portalExitBlink, false)
  assert.equal(game.control.numberBlink, true)
  assert.equal(game.control.showWhat, 'number')
  advance(900)
  await settle()
  assert.equal(game.control.showWhat, 'accomplish')
  assert.ok(button(level, 'OK'))
})

for (const phase of ['entrance', 'exit']) {
  for (const cancellation of ['CLR', 'settings', 'level', 'dispose']) {
    test(`${cancellation} cancels portal animation during ${phase} blink`, async (context) => {
      const advance = useFakeClock(context)
      const { game, level } = init(levels[180])
      button(level, '1').operation()
      if (phase === 'exit') {
        advance(900)
        await settle()
        assert.equal(game.control.portalExitBlink, true)
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
      assert.equal(level.portalAnimating, false)
      if (cancellation !== 'dispose') {
        assert.equal(game.control.portalEntranceBlink, false)
        assert.equal(game.control.portalExitBlink, false)
      }
      advance(5000)
      await settle()
      assert.equal(level.screenInfo.currentNum, number)
      assert.equal(level.screenInfo.currentStep, steps)
      assert.equal(level.portalAnimating, false)
    })
  }
}

test('a cancelled portal animation cannot clear the next animation state', async (context) => {
  const advance = useFakeClock(context)
  const { game, level } = init(levels[180])
  button(level, '1').operation()
  button(level, 'CLR').operation()
  button(level, '1').operation()
  assert.equal(game.control.numberBlink, false)
  advance(900)
  await settle()
  assert.equal(level.screenInfo.currentNum, 100)
  assert.equal(level.portalAnimating, true)
  assert.equal(game.control.portalEntranceBlink, false)
  assert.equal(game.control.portalExitBlink, true)
})

test('number blinking affects only lit segments while the LCD background and portal markers stay steady', async () => {
  const props = reactive({
    ledOptions: { values: 12, width: 36, height: 60, lineWidth: 5, color: '#3b3c3a', italics: -8, opacity: 0.1 },
    portals: { entrance: 3, exit: 0 },
    numberBlink: true,
  })
  const root = element()
  const app = renderer.createApp({ render: () => h(LedStyleCanvas, props) })
  apps.push(app)
  app.mount(root)
  function find(node, type) {
    return [...(node.type === type ? [node] : []), ...node.children.flatMap(child => find(child, type))]
  }
  const [background, foreground] = find(root, 'canvas')
  const markers = find(root, 'svg')
  assert.equal(background.strokes.length, 28)
  assert.ok(background.strokes.every(alpha => alpha === 0.1))
  assert.equal(foreground.strokes.filter(alpha => alpha === 1).length, 7)
  assert.ok(foreground.strokes.slice(0, 14).every(alpha => alpha === 0))
  assert.match(foreground.props.class, /blink/)
  assert.ok(!background.props.class?.includes('blink'))
  assert.ok(markers.every(marker => !marker.props.class.includes('blink')))
  props.numberBlink = false
  await nextTick()
  assert.ok(!foreground.props.class.includes('blink'))
  assert.equal(background.strokes.length, 28)
})
