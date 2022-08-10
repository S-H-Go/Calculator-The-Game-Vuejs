export interface ILedOptions {
    color: string,
    width: number,
    height: number,
    values: number,
    lineWidth: number,
    italics: number,
    opacity: number,
}
//显示什么
export enum ShowWhat {
    "number" = "number",
    "error" = "error",
    "accomplish" = "accomplish",
    "pause" = "pause",
    "conversation" = "conversation"
}

//关卡数据的接口
export interface ILevelData {
    level: number,
    initialNum: number,
    initialStep: number,
    goal: number,
    buttons: string[],
    path: string[],
    dialogue: {
        info: string,
        buttons: { info: string, position: number }[]
    }[],
}