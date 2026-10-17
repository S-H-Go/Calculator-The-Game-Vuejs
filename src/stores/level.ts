import { defineStore } from 'pinia'
import { computed, onScopeDispose, reactive, ref } from 'vue'
import { BlinkEnum, ButtonEnum, type IButtonInfo, type IDialogueItem, type ILevelData, type IScreenInfo, ShowWhat } from '../modules/interface'
import { getButtonClass, getButtonText, isPreviewButtonToken, parseButtonToken } from '../modules/operations'
import { createAcceleratingRepeat } from '../modules/acceleratingRepeat'
import { useGameStore } from '.'

enum LevelModeEnum {
  NORMAL,
  DIALOGUE,
  SET,
}

const normalButtonPositions = [
  { x: 2, y: 1 },
  { x: 2, y: 2 },
  { x: 3, y: 2 },
  { x: 2, y: 3 },
  { x: 3, y: 3 },
]

const emptyDialogue: IDialogueItem[] = [{ info: '', buttons: [{ info: '', position: 0 }] }]

export const useLevelStore = defineStore('level', () => {
  const levelData = reactive({} as ILevelData)
  const screenInfo = reactive({
    level: 0,
    currentNum: 0,
    currentStep: 0,
    goal: 0,
    ledOptions: {
      color: '#3b3c3a',
      width: 36,
      height: 60,
      values: 0,
      lineWidth: 5,
      italics: -8,
      opacity: 0.1,
    },
    ledCanvasKey: 0,
    dialogue: emptyDialogue,
    dialogueIndex: 0,
  } as IScreenInfo)
  const levelMode = ref(LevelModeEnum.NORMAL)
  const buttons = computed<IButtonInfo[]>(() => {
    switch (levelMode.value) {
      case LevelModeEnum.NORMAL:
        return getNormalButtons()
      case LevelModeEnum.DIALOGUE:
        return getDialogueButtons()
      case LevelModeEnum.SET:
        return getSetButtons()
    }
  })
  const levelButtons = ref<string[]>([])
  const storeValue = ref<string | number>('Store')
  const completed = ref(false)
  let revision = 0

  let storeTimer: ReturnType<typeof setTimeout> | undefined
  let storeLongPressed = false
  const levelIncreaseRepeat = createAcceleratingRepeat(() => useGameStore().levelIncrease())
  const levelReductionRepeat = createAcceleratingRepeat(() => useGameStore().levelReduction())

  function setShowWhat(showWhat: ShowWhat) {
    useGameStore().control.showWhat = showWhat
  }

  function isDialogueLevel(dialogue: IDialogueItem[] | undefined) {
    return Boolean(dialogue?.length && dialogue[0]?.info)
  }

  function refreshLed(value: number) {
    screenInfo.currentNum = value
    screenInfo.ledOptions.values = value
    screenInfo.ledCanvasKey++
  }

  async function changeCurrentNum(value: number) {
    if (!canOperate())
      return

    if (Number.isSafeInteger(value) && Math.abs(value) < 1000000) {
      screenInfo.currentStep--
      refreshLed(value)
      setShowWhat(ShowWhat.number)
    }
    else {
      setShowWhat(ShowWhat.error)
      return
    }

    if (screenInfo.currentNum === screenInfo.goal) {
      completed.value = true
      const currentRevision = revision
      await useGameStore().blink(BlinkEnum.number)
      if (currentRevision === revision && levelMode.value === LevelModeEnum.NORMAL)
        setShowWhat(ShowWhat.accomplish)
    }
    else if (screenInfo.currentStep === 0) {
      await useGameStore().blink(BlinkEnum.step)
    }
  }

  function createButton(position: { x: number, y: number }, token: string, operation?: () => void | Promise<void>, extra: Partial<IButtonInfo> = {}) {
    return {
      x: position.x,
      y: position.y,
      text: getButtonText(token, token === ButtonEnum.Store ? storeValue.value : undefined),
      colorClass: getButtonClass(token),
      operation,
      ...extra,
    } satisfies IButtonInfo
  }

  function createEmptyButton(position: { x: number, y: number }) {
    return createButton(position, ButtonEnum.empty, undefined, { disabled: true })
  }

  function executeArithmetic(operator: '+' | '-' | 'x' | '/', amount: number) {
    if (screenInfo.currentStep <= 0)
      return

    switch (operator) {
      case '+':
        void changeCurrentNum(screenInfo.currentNum + amount)
        break
      case '-':
        void changeCurrentNum(screenInfo.currentNum - amount)
        break
      case 'x':
        if (screenInfo.currentNum !== 0)
          void changeCurrentNum(screenInfo.currentNum * amount)
        break
      case '/':
        if (screenInfo.currentNum !== 0 && amount !== 0)
          void changeCurrentNum(screenInfo.currentNum / amount)
        break
    }
  }

  function clearLevel() {
    revision++
    useGameStore().resetBlinks()
    completed.value = false
    cancelStorePress()
    screenInfo.currentStep = levelData.initialStep
    storeValue.value = 'Store'
    levelButtons.value = [...levelData.buttons]
    refreshLed(levelData.initialNum)
    setShowWhat(levelMode.value === LevelModeEnum.DIALOGUE ? ShowWhat.conversation : ShowWhat.number)
    void useGameStore().blink(BlinkEnum.number)
  }

  function square() {
    if (screenInfo.currentNum !== 0 && screenInfo.currentStep > 0)
      void changeCurrentNum(screenInfo.currentNum ** 2)
  }

  function cube() {
    if (screenInfo.currentNum !== 0 && screenInfo.currentStep > 0)
      void changeCurrentNum(screenInfo.currentNum ** 3)
  }

  function deleteLastDigit() {
    if (screenInfo.currentStep <= 0 || screenInfo.currentNum === 0)
      return

    const numStr = screenInfo.currentNum.toString()
    if ((numStr.includes('-') && numStr.length === 2) || numStr.length === 1) {
      void changeCurrentNum(0)
      return
    }

    void changeCurrentNum(Number(numStr.slice(0, -1)))
  }

  function opposite() {
    if (screenInfo.currentStep > 0 && screenInfo.currentNum !== 0)
      void changeCurrentNum(screenInfo.currentNum * -1)
  }

  function reverse() {
    if (screenInfo.currentStep <= 0 || screenInfo.currentNum === 0)
      return

    const numStr = screenInfo.currentNum.toString()
    if (numStr.includes('-'))
      void changeCurrentNum(Number(`-${numStr.replace('-', '').split('').reverse().join('')}`))
    else
      void changeCurrentNum(Number(numStr.split('').reverse().join('')))
  }

  function sumDigits() {
    if (screenInfo.currentStep <= 0 || screenInfo.currentNum === 0)
      return

    const numStr = screenInfo.currentNum.toString().replace('-', '')
    let total = 0
    for (const char of numStr)
      total += Number(char)

    void changeCurrentNum(screenInfo.currentNum < 0 ? total * -1 : total)
  }

  function shiftLeft() {
    if (screenInfo.currentStep <= 0 || screenInfo.currentNum === 0)
      return

    const digits = screenInfo.currentNum.toString().replace('-', '').split('')
    digits.push(String(digits.shift()))
    const nextValue = digits.join('')
    void changeCurrentNum(screenInfo.currentNum < 0 ? Number(`-${nextValue}`) : Number(nextValue))
  }

  function shiftRight() {
    if (screenInfo.currentStep <= 0 || screenInfo.currentNum === 0)
      return

    const digits = screenInfo.currentNum.toString().replace('-', '').split('')
    digits.unshift(String(digits.pop()))
    const nextValue = digits.join('')
    void changeCurrentNum(screenInfo.currentNum < 0 ? Number(`-${nextValue}`) : Number(nextValue))
  }

  function mirror() {
    if (screenInfo.currentStep <= 0)
      return

    const digits = screenInfo.currentNum.toString().replace('-', '').split('')
    for (let index = digits.length - 1; index >= 0; index--)
      digits.push(digits[index])

    const nextValue = digits.join('')
    void changeCurrentNum(screenInfo.currentNum < 0 ? Number(`-${nextValue}`) : Number(nextValue))
  }

  function inv10() {
    if (screenInfo.currentStep <= 0)
      return

    const digits = screenInfo.currentNum.toString().split('')
    const nextDigits = digits.map((digit) => {
      if (digit === '-')
        return '-'
      if (digit === '0')
        return '0'
      return String(10 - Number(digit))
    })
    void changeCurrentNum(Number(nextDigits.join('')))
  }

  function insertNumber(value: number) {
    if (screenInfo.currentStep > 0)
      void changeCurrentNum(Number(screenInfo.currentNum.toString() + value))
  }

  function replaceNumber(from: string, to: string) {
    if (screenInfo.currentStep <= 0)
      return

    const nextValue = Number(screenInfo.currentNum.toString().replace(new RegExp(from, 'g'), to))
    void changeCurrentNum(nextValue)
  }

  function eachButton(operator: '+' | '-' | 'x' | '/', value: number) {
    if (!canOperate())
      return

    screenInfo.currentStep--
    levelButtons.value = levelButtons.value.map((token) => {
      const parsed = parseButtonToken(token)
      if (!parsed)
        return token

      if (parsed.type === 'insert')
        return `insert${calculateEachValue(parsed.value, operator, value)}`

      if (parsed.type === 'arithmetic')
        return `${parsed.operator}${calculateEachValue(parsed.value, operator, value)}`

      return token
    })
    if (screenInfo.currentStep === 0)
      void useGameStore().blink(BlinkEnum.step)
  }

  function calculateEachValue(target: number, operator: '+' | '-' | 'x' | '/', operand: number) {
    switch (operator) {
      case '+':
        return target + operand
      case '-':
        return target - operand
      case 'x':
        return target * operand
      case '/':
        return target / operand
    }
  }

  function goToNextLevel() {
    useGameStore().levelIncrease()
  }

  function highlightDialogue() {
    const info = screenInfo.dialogue[screenInfo.dialogueIndex]?.info
    if (info === '好,看到这个数字了吗?')
      void useGameStore().blink(BlinkEnum.goal)
    else if (info === '看见这个数字了吗?')
      void useGameStore().blink(BlinkEnum.step)
  }

  function completeCurrentLevel() {
    if (isDialogueLevel(levelData.dialogue)) {
      levelMode.value = LevelModeEnum.DIALOGUE
      setShowWhat(ShowWhat.conversation)
      screenInfo.dialogueIndex = 0
      highlightDialogue()
    }
    else {
      goToNextLevel()
    }
  }

  function advanceDialogue() {
    if (screenInfo.dialogueIndex < screenInfo.dialogue.length - 1) {
      screenInfo.dialogueIndex++
      highlightDialogue()
    }
    else {
      goToNextLevel()
    }
  }

  function jumpDialogue() {
    screenInfo.dialogueIndex = Math.min(2, screenInfo.dialogue.length - 1)
    highlightDialogue()
  }

  function startStorePress() {
    if (!canOperate())
      return

    cancelStorePress()
    storeTimer = setTimeout(() => {
      storeTimer = undefined
      if (!canOperate())
        return
      storeLongPressed = true
      storeValue.value = screenInfo.currentNum
      void changeCurrentNum(screenInfo.currentNum)
    }, 500)
  }

  function endStorePress() {
    if (storeTimer)
      clearTimeout(storeTimer)

    if (!storeLongPressed && canOperate() && Number.isFinite(storeValue.value))
      void changeCurrentNum(Number(`${screenInfo.currentNum}${storeValue.value}`))

    storeTimer = undefined
    storeLongPressed = false
  }

  function cancelStorePress() {
    if (storeTimer)
      clearTimeout(storeTimer)
    storeTimer = undefined
    storeLongPressed = false
  }

  function startLevelIncrease() {
    stopLevelReduction()
    levelIncreaseRepeat.start()
  }

  function stopLevelIncrease() {
    levelIncreaseRepeat.stop()
  }

  function startLevelReduction() {
    stopLevelIncrease()
    levelReductionRepeat.start()
  }

  function stopLevelReduction() {
    levelReductionRepeat.stop()
  }

  function canOperate() {
    return levelMode.value === LevelModeEnum.NORMAL
      && useGameStore().control.showWhat === ShowWhat.number
      && screenInfo.currentStep > 0
      && !completed.value
  }

  function createNormalButton(token: string, position: { x: number, y: number }): IButtonInfo {
    const button = createActionButton(token, position)
    if (token === ButtonEnum.CLR || token === ButtonEnum.OK || token === ButtonEnum.set)
      return button
    return { ...button, disabled: button.disabled || !canOperate() }
  }

  function createActionButton(token: string, position: { x: number, y: number }) {
    const parsed = parseButtonToken(token)
    if (!parsed)
      return createEmptyButton(position)

    switch (parsed.type) {
      case 'single':
        switch (parsed.token) {
          case ButtonEnum.CLR:
            return createButton(position, token, clearLevel)
          case ButtonEnum.OK:
            return createButton(position, token, completeCurrentLevel)
          case ButtonEnum.Delete:
            return createButton(position, token, deleteLastDigit)
          case ButtonEnum.Square:
            return createButton(position, token, square)
          case ButtonEnum.Cube:
            return createButton(position, token, cube)
          case ButtonEnum.Opposite:
            return createButton(position, token, opposite)
          case ButtonEnum.Reverse:
            return createButton(position, token, reverse)
          case ButtonEnum.SUM:
            return createButton(position, token, sumDigits)
          case ButtonEnum.ShiftLeft:
            return createButton(position, token, shiftLeft)
          case ButtonEnum.ShiftRight:
            return createButton(position, token, shiftRight)
          case ButtonEnum.Mirror:
            return createButton(position, token, mirror)
          case ButtonEnum.Inv10:
            return createButton(position, token, inv10)
          case ButtonEnum.Store:
            return createButton(position, token, undefined, {
              onPressStart: startStorePress,
              onPressEnd: endStorePress,
              onPressCancel: cancelStorePress,
            })
          case ButtonEnum.set:
            return createButton(position, token, () => useGameStore().toggleMode())
          case ButtonEnum.LevelIncrease:
            return createButton(position, token, undefined, {
              onPressStart: startLevelIncrease,
              onPressEnd: stopLevelIncrease,
              onPressCancel: stopLevelIncrease,
            })
          case ButtonEnum.LevelReduction:
            return createButton(position, token, undefined, {
              onPressStart: startLevelReduction,
              onPressEnd: stopLevelReduction,
              onPressCancel: stopLevelReduction,
            })
          default:
            return createButton(position, token)
        }
      case 'arithmetic':
        return createButton(position, token, () => executeArithmetic(parsed.operator, parsed.value))
      case 'insert':
        return createButton(position, token, () => insertNumber(parsed.value))
      case 'replace':
        return createButton(position, token, () => replaceNumber(parsed.from, parsed.to))
      case 'each':
        return createButton(position, token, () => eachButton(parsed.operator, parsed.value))
      case 'empty':
        return createEmptyButton(position)
    }
  }

  function createConversationButton(position: { x: number, y: number }, token: string) {
    const storedPreview = /^Store(-?\d+)$/.exec(token)
    if (storedPreview)
      return createButton(position, ButtonEnum.Store, undefined, { text: storedPreview[1], disabled: true })

    if (isPreviewButtonToken(token))
      return createButton(position, token, undefined, { disabled: true })

    const fontSize = token.length <= 2 ? '2rem' : token.length <= 6 ? '1.4rem' : '1rem'
    return {
      x: position.x,
      y: position.y,
      text: token,
      colorClass: token === '不明白' ? 'color-button-clr' : 'color-button-green',
      fontSize,
      operation: token === '不明白' ? jumpDialogue : advanceDialogue,
    } satisfies IButtonInfo
  }

  function getNormalButtons() {
    const nextButtons: IButtonInfo[] = [
      createEmptyButton({ x: 1, y: 1 }),
      createEmptyButton({ x: 1, y: 2 }),
      createNormalButton(ButtonEnum.set, { x: 1, y: 3 }),
      createNormalButton(useGameStore().control.showWhat === ShowWhat.accomplish ? ButtonEnum.OK : ButtonEnum.CLR, { x: 3, y: 1 }),
    ]

    levelButtons.value.forEach((token, index) => {
      const position = normalButtonPositions[index]
      if (position)
        nextButtons.push(createNormalButton(token, position))
    })

    for (let index = levelButtons.value.length; index < normalButtonPositions.length; index++)
      nextButtons.push(createEmptyButton(normalButtonPositions[index]))

    return nextButtons
  }

  function getDialogueButtons() {
    const currentDialogue = screenInfo.dialogue[screenInfo.dialogueIndex] ?? emptyDialogue[0]
    const occupied = new Set<string>()
    const nextButtons: IButtonInfo[] = []

    for (const button of currentDialogue.buttons) {
      const position = {
        x: button.position % 3 + 1,
        y: Math.floor(button.position / 3) + 1,
      }
      occupied.add(`${position.x}-${position.y}`)
      nextButtons.push(createConversationButton(position, button.info))
    }

    for (let y = 1; y <= 3; y++) {
      for (let x = 1; x <= 3; x++) {
        const key = `${x}-${y}`
        if (!occupied.has(key))
          nextButtons.push(createEmptyButton({ x, y }))
      }
    }

    return nextButtons
  }

  function getSetButtons(): IButtonInfo[] {
    return [
      createButton({ x: 1, y: 1 }, '该游戏非原创', undefined, {
        colorClass: 'color-button-clr',
        fontSize: '1rem',
        disabled: true,
      }),
      createButton({ x: 2, y: 1 }, '原游戏', undefined, {
        colorClass: 'color-button-clr',
        href: 'https://www.taptap.com/app/56200',
      }),
      createEmptyButton({ x: 3, y: 1 }),
      createButton({ x: 1, y: 2 }, ButtonEnum.LevelReduction, undefined, {
        onPressStart: startLevelReduction,
        onPressEnd: stopLevelReduction,
        onPressCancel: stopLevelReduction,
      }),
      {
        x: 2,
        y: 2,
        text: `等级\n${screenInfo.level}`,
        colorClass: 'color-button-1f2d3a',
        disabled: true,
        fontSize: '1.2rem',
      },
      createButton({ x: 3, y: 2 }, ButtonEnum.LevelIncrease, undefined, {
        onPressStart: startLevelIncrease,
        onPressEnd: stopLevelIncrease,
        onPressCancel: stopLevelIncrease,
      }),
      createNormalButton(ButtonEnum.set, { x: 1, y: 3 }),
      createButton({ x: 2, y: 3 }, '源代码', undefined, {
        colorClass: 'color-button-purple',
        href: 'https://github.com/S-H-Go/calculator-game-web',
      }),
      createEmptyButton({ x: 3, y: 3 }),
    ]
  }

  function initLevel(level: ILevelData) {
    const keepSetMode = levelMode.value === LevelModeEnum.SET
    // Keep a held level-selector running while its displayed level changes.
    revision++
    useGameStore().resetBlinks()
    completed.value = false
    cancelStorePress()
    Object.assign(levelData, { ...level, portals: level.portals, dialogue: level.dialogue })
    levelButtons.value = [...level.buttons]
    storeValue.value = 'Store'
    Object.assign(screenInfo, {
      level: level.level,
      currentNum: level.initialNum,
      currentStep: level.initialStep,
      goal: level.goal,
      dialogue: level.dialogue?.length ? level.dialogue : emptyDialogue,
      dialogueIndex: 0,
      ledOptions: {
        ...screenInfo.ledOptions,
        values: level.initialNum,
      },
      ledCanvasKey: screenInfo.ledCanvasKey + 1,
    })

    if (keepSetMode) {
      levelMode.value = LevelModeEnum.SET
      setShowWhat(ShowWhat.pause)
      useGameStore().control.pauseBlink = true
    }
    else {
      levelMode.value = level.buttons.length === 0 ? LevelModeEnum.DIALOGUE : LevelModeEnum.NORMAL
      setShowWhat(levelMode.value === LevelModeEnum.DIALOGUE ? ShowWhat.conversation : ShowWhat.number)
      if (levelMode.value === LevelModeEnum.DIALOGUE)
        highlightDialogue()
    }
  }

  function enterSetMode() {
    revision++
    useGameStore().resetBlinks()
    cancelStorePress()
    levelMode.value = LevelModeEnum.SET
  }

  function exitSetMode() {
    stopLevelIncrease()
    stopLevelReduction()
    levelMode.value = LevelModeEnum.NORMAL
    initLevel(levelData)
  }

  onScopeDispose(() => {
    cancelStorePress()
    stopLevelIncrease()
    stopLevelReduction()
  })

  return {
    initLevel,
    enterSetMode,
    exitSetMode,
    completeCurrentLevel,
    advanceDialogue,
    jumpDialogue,
    screenInfo,
    buttons,
  }
})
