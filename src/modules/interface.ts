export interface ILedOptions {
  color: string
  width: number
  height: number
  values: number
  lineWidth: number
  italics: number
  opacity: number
}

export interface IDialogueButton {
  info: string
  position: number
}

export interface IDialogueItem {
  info: string
  buttons: IDialogueButton[]
}

// 关卡数据的接口
export interface IPortals {
  /** Digit positions count from the right: units = 0. */
  entrance: number
  exit: number
}

export interface ILevelData {
  level: number
  initialNum: number
  initialStep: number
  goal: number
  buttons: string[]
  path: string[]
  portals?: IPortals
  dialogue?: IDialogueItem[]
}

// 显示信息的接口
export interface IScreenInfo {
  level: number
  currentNum: number
  currentStep: number
  goal: number
  ledOptions: ILedOptions
  ledCanvasKey: number
  dialogue: IDialogueItem[]
  dialogueIndex: number
  portals?: IPortals
}

export interface IButtonInfo {
  x: number
  y: number
  text: string
  colorClass: string
  disabled?: boolean
  fontSize?: string
  href?: string
  operation?: () => void | Promise<void>
  onPressStart?: () => void
  onPressEnd?: () => void
  onPressCancel?: () => void
}

// 显示什么
export enum ShowWhat {
  number = 'number',
  error = 'error',
  accomplish = 'accomplish',
  pause = 'pause',
  conversation = 'conversation',
}

export enum LSKey {
  levelIndex = 'levelIndex',
  maxLevelIndex = 'maxlevelIndex',
}

export enum BlinkEnum {
  number = 'number',
  step = 'step',
  goal = 'goal',
  pause = 'pause',
}

export enum ButtonEnum {
  CLR = 'CLR',
  set = 'set',
  OK = 'OK',
  empty = '',
  Delete = '<<',
  Square = 'x²',
  Cube = 'x³',
  Opposite = '+/-',
  Reverse = 'Reverse',
  SUM = 'SUM',
  ShiftLeft = 'Shift<',
  ShiftRight = 'Shift>',
  Mirror = 'Mirror',
  Store = 'Store',
  Inv10 = 'Inv10',
  LevelIncrease = '+',
  LevelReduction = '-',
}
