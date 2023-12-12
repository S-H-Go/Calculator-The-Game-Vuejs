export interface ILedOptions {
  color: string
  width: number
  height: number
  values: number
  lineWidth: number
  italics: number
  opacity: number
}

// 关卡数据的接口
export interface ILevelData {
  level: number
  initialNum: number
  initialStep: number
  goal: number
  buttons: string[]
  path: string[]
  portals: { entrance: number, exit: number }
  dialogue: {
    info: string
    buttons: { info: string, position: number }[]
  }[]
}

// 显示什么
export enum ShowWhat {
  'number' = 'number',
  'error' = 'error',
  'accomplish' = 'accomplish',
  'pause' = 'pause',
  'conversation' = 'conversation',
}

export enum LSKey {
  'levelIndex' = 'levelIndex',
  'maxLevelIndex' = 'maxlevelIndex',
}

export enum BlinkEnum {
  'number' = 'number',
  'step' = 'step',
  'goal' = 'goal',
  'pause' = 'pause',
}
