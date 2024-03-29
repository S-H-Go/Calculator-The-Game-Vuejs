import { defineStore } from 'pinia'
import levelData from '../assets/levelData.json'
import type { ILedOptions } from './interface'
import { BlinkEnum, LSKey, ShowWhat } from './interface'

// import levelData from "../assets/testLevelData.json"
import { ButtonControl } from './ButtonsControl'

// 初始化本地关卡索引
if (localStorage.getItem(LSKey.levelIndex) === null)
  localStorage.setItem(LSKey.levelIndex, '0')
// 清除最大关卡索引
localStorage.removeItem(LSKey.maxLevelIndex)

// css动画闪烁一次的时间
const blinkTime = 300
export const useStore = defineStore('main', {
  state: () => {
    return {
      data: {
        // 全局数据
        currentLevelIndex: Number(localStorage.getItem('levelIndex')),
        errorInfo: '错误',
        accomplishInfo: '你赢了',
        pauseInfo: '暂停',
        // 当前关卡数据
        level: levelData[0].level,
        initialNum: levelData[0].initialNum,
        initialStep: levelData[0].initialStep,
        step: 0,
        goal: 0,
        storeNum: 'Store' as string | number,
        ledCanvasKey: Math.random(),
        ledOptions: {
          color: '#3b3c3a',
          width: 36,
          height: 60,
          values: 0,
          lineWidth: 5,
          italics: -8,
          opacity: 0.1,
        } as ILedOptions,
        conversation: [{ info: '', buttons: [{ info: '', position: 0 }] }],
        conversationIndex: 0,
      },
      control: {
        showWhat: ShowWhat.number,
        numberBlink: false,
        stepBlink: false,
        goalBlink: false,
        pauseBlink: false,
      },
      buttons: [['', '', ''], ['', '', ''], ['', '', '']] as any[][],
      allLevelData: levelData,
      buttonsControl: new ButtonControl(),
    }
  },
  getters: {
    getScreenData(state) {
      return state.data
    },
    getScreenControl(state) {
      return state.control
    },
    getButtonControl(state) {
      return {
        showWhat: state.control.showWhat,
      }
    },
    getButtonList(state) {
      return state.buttons
    },
    getButtonData(state) {
      return { currentNum: state.data.ledOptions.values, step: state.data.step }
    },
    getStoreNum(state) {
      return state.data.storeNum
    },
  },
  actions: { // 更改当前数字后，判断是否错误以及是否完成
    async changeCurrentNum(num: number) {
      // 值小于100000并且不是小数
      // 数字在正确范围则更改
      if (num < 1000000 && !num.toString().includes('.')) {
        this.data.step--
        this.data.ledOptions.values = num
        this.data.ledCanvasKey++
      }
      else {
        this.control.showWhat = ShowWhat.error
      }
      // 更改之后判断是否达到目标（通关）
      if (this.data.ledOptions.values === this.data.goal) {
        await this.blink(BlinkEnum.number, blinkTime * 3)
        this.control.showWhat = ShowWhat.accomplish
        this.buttonsControl.accomplish(this.buttons)
      }
      else if (this.data.step === 0) { // 没达到目标并且步数为0，执行步数闪烁
        await this.blink(BlinkEnum.step, blinkTime * 3)
      }
    },
    // clr的初始化
    async clr() {
      this.data.ledOptions.values = this.data.initialNum
      this.data.step = this.data.initialStep
      this.control.showWhat = ShowWhat.number
      this.data.storeNum = 'Store'
      this.data.ledCanvasKey--
      if (this.buttonsControl.isIncludeEachButtons()) { // 如果有按钮的数字则需要关卡初始化
        this.levelInit()
      }
      await this.blink(BlinkEnum.number, blinkTime * 3)
    },
    // 关卡初始化
    levelInit() {
      // 将当前关卡索引存到本地
      localStorage.setItem('levelIndex', this.data.currentLevelIndex.toString())

      // 存储当前关卡索引
      const level = this.data.currentLevelIndex
      // 全部初始化
      this.$reset()
      // 恢复当前关卡索引
      this.data.currentLevelIndex = level
      // 获取关卡数据
      this.data.level = this.allLevelData[this.data.currentLevelIndex].level
      this.data.initialNum = this.allLevelData[this.data.currentLevelIndex].initialNum
      this.data.initialStep = this.allLevelData[this.data.currentLevelIndex].initialStep
      this.data.goal = this.allLevelData[this.data.currentLevelIndex].goal
      this.data.step = this.data.initialStep
      this.data.ledOptions.values = this.data.initialNum
      this.data.conversation = this.allLevelData[this.data.currentLevelIndex].dialogue
      // 为第0关特制，如果没有按钮则直接显示对话
      if (this.allLevelData[this.data.currentLevelIndex].buttons.length === 0)
        this.control.showWhat = ShowWhat.conversation

      this.updateButtonList()
    },
    // 更新显示的按钮列表
    async updateButtonList() {
      this.buttons = [['', '', ''], ['', '', ''], ['', '', '']]
      if (this.control.showWhat === ShowWhat.conversation) {
        this.buttons = this.buttonsControl.updateConversationButtonsList(this.data.conversation[this.data.conversationIndex].buttons)
        // 第一次玩该游戏对话时的目标和步数闪烁
        if (this.data.conversation[this.data.conversationIndex].info === '好,看到这个数字了吗?')
          await this.blink(BlinkEnum.goal, blinkTime * 3)

        if (this.data.conversation[this.data.conversationIndex].info === '看见这个数字了吗?')
          await this.blink(BlinkEnum.step, blinkTime * 3)
      }
      else {
        this.buttons = this.buttonsControl.updateButtonsList(this.allLevelData[this.data.currentLevelIndex].buttons)
      }
    },
    // 每个数字都操作的按钮
    eachButton(operation: string, num: number) {
      if (this.data.step > 0) {
        this.data.step--
        this.buttonsControl.eachButton(operation, num)
        this.updateButtonList()
      }
    },

    // OK按钮专用，用于跳转到下一关
    accomplish() {
      // 如果还有关卡
      if (this.data.currentLevelIndex < this.allLevelData.length - 1) {
        // 如果显示的是对话，则说明该关已完结，关卡增加
        if (this.control.showWhat === ShowWhat.conversation) {
          this.data.currentLevelIndex++
          this.levelInit()
        }
        else {
          // 如果有对话则显示对话，否则到下一关
          if (this.allLevelData[this.data.currentLevelIndex].dialogue[0].info !== '') {
            this.control.showWhat = ShowWhat.conversation
            this.updateButtonList()
          }
          else {
            this.data.currentLevelIndex++
            this.levelInit()
          }
        }
      }
      else {
        this.data.currentLevelIndex = 1
        this.levelInit()
      }
    },
    conversationAccomplish() {
      if (this.data.conversationIndex < this.data.conversation.length - 1) {
        this.data.conversationIndex++
        this.updateButtonList()
      }
      else {
        this.accomplish()
      }
    },
    jumpConversation() {
      this.data.conversationIndex = 2
      this.updateButtonList()
    },
    changeMode() {
      if (this.control.showWhat === ShowWhat.pause) {
        // 如果是设置模式，点击就切换初始模式
        this.control.showWhat = ShowWhat.number
        this.control.pauseBlink = false
        // 从设置切换到初始模式时初始化关卡
        this.levelInit()
      }
      else {
        this.control.showWhat = ShowWhat.pause
        this.control.pauseBlink = true
      }
    },
    levelIncrease() {
      if (this.data.currentLevelIndex < this.allLevelData.length - 1)
        this.data.currentLevelIndex++
    },
    levelReduction() {
      if (this.data.currentLevelIndex > 1)
        this.data.currentLevelIndex--
    },
    async blink(thing: BlinkEnum, delay: number) {
      const sleep = (timeout: number) => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve()
          }, timeout)
        })
      }
      // 这里在for循环外switch虽然多一些代码，但不用每次for循环都要执行一次或两次switch
      switch (thing) {
        case BlinkEnum.number: {
          this.control.numberBlink = true
          await sleep(delay)
          this.control.numberBlink = false
          break
        }
        case BlinkEnum.step: {
          this.control.stepBlink = true
          await sleep(delay)
          this.control.stepBlink = false
          break
        }
        case BlinkEnum.goal: {
          this.control.goalBlink = true
          await sleep(delay)
          this.control.goalBlink = false
          break
        }
        case BlinkEnum.pause: {
          this.control.pauseBlink = true
          await sleep(delay)
          this.control.pauseBlink = false
          break
        }
      }
    },
  },
})
