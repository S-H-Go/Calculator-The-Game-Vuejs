import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import levelData from '../assets/levelData.json'
import { BlinkEnum, LSKey, ShowWhat } from '../modules/interface'
import { useLevelStore } from './level'

const blinkTime = 300

if (localStorage.getItem(LSKey.levelIndex) === null)
  localStorage.setItem(LSKey.levelIndex, '0')

localStorage.removeItem(LSKey.maxLevelIndex)

export const useGameStore = defineStore('game', () => {
  const savedLevel = Number(localStorage.getItem(LSKey.levelIndex))
  const currentLevel = ref(Number.isInteger(savedLevel) && savedLevel >= 0 && savedLevel < levelData.length ? savedLevel : 0)
  const initialized = ref(false)
  const control = reactive({
    showWhat: ShowWhat.number,
    numberBlink: false,
    stepBlink: false,
    goalBlink: false,
    pauseBlink: false,
  })

  function persistLevel() {
    localStorage.setItem(LSKey.levelIndex, currentLevel.value.toString())
  }

  function init() {
    if (initialized.value)
      return

    initialized.value = true
    useLevelStore().initLevel(levelData[currentLevel.value])
  }

  function setCurrentLevel(nextLevel: number) {
    currentLevel.value = nextLevel
    persistLevel()
    useLevelStore().initLevel(levelData[currentLevel.value])
  }

  function levelIncrease() {
    const nextLevel = currentLevel.value < levelData.length - 1 ? currentLevel.value + 1 : 0
    setCurrentLevel(nextLevel)
  }

  function levelReduction() {
    const nextLevel = currentLevel.value > 0 ? currentLevel.value - 1 : levelData.length - 1
    setCurrentLevel(nextLevel)
  }

  function toggleMode() {
    const levelStore = useLevelStore()
    if (control.showWhat === ShowWhat.pause) {
      control.showWhat = ShowWhat.number
      control.pauseBlink = false
      levelStore.exitSetMode()
    }
    else {
      control.showWhat = ShowWhat.pause
      levelStore.enterSetMode()
      control.pauseBlink = true
    }
  }

  const blinkVersions = { number: 0, step: 0, goal: 0, pause: 0 }

  function resetBlinks() {
    for (const thing of Object.values(BlinkEnum)) {
      blinkVersions[thing]++
      control[`${thing}Blink`] = false
    }
  }

  async function blink(thing: BlinkEnum, delay: number = blinkTime * 3) {
    const version = ++blinkVersions[thing]
    control[`${thing}Blink`] = true
    await new Promise<void>(resolve => setTimeout(resolve, delay))
    if (version === blinkVersions[thing])
      control[`${thing}Blink`] = false
  }

  return { init, toggleMode, levelIncrease, levelReduction, blink, resetBlinks, control, currentLevel }
})
