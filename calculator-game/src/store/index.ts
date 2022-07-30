import { defineStore } from "pinia"
import { buttonFactory } from "./buttonFactory"
import levelData from "../assets/levelData.json"
// import levelData from "../assets/testLevelData.json"
export interface ILedOptions {
    color: string,
    width: number,
    height: number,
    values: number,
    lineWidth: number,
    italics: number,
    opacity: number,
}
export const useStore = defineStore("main", {
    state: () => {
        return {
            data: {
                //全局数据
                currentLevelIndex: 0,
                errorInfo: "错误",
                accomplishInfo: "你赢了",
                pauseInfo: "暂停",
                //当前关卡数据
                level: levelData[0].level,
                initialNum: levelData[0].initialNum,
                initialStep: levelData[0].initialStep,
                step: 0,
                goal: 0,
                storeNum: "Store" as string | number,
                ledCanvasKey: Math.random(),
                ledOptions: {
                    color: "#464948",
                    width: 36,
                    height: 60,
                    values: 0,
                    lineWidth: 5,
                    italics: 0,
                    opacity: 0.1,
                } as ILedOptions
            },
            control: {
                ledCanvasDisplay: true,
                error: false,
                accomplish: false,
                initialMode: true,
                setMode: false,
            },
            buttonList: [] as any,
            allLevelData: levelData,
            buttonsControl: {
                ["<<" as string]: false,
                'x²': false,
                '+/-': false,
                Reverse: false,
                SUM: false,
                'x³': false,
                'Shift<': false,
                'Shift>': false,
                Mirror: false,
                Store: false,
                Inv10: false,
                insert: [] as number[],
                replace: {
                    num1: [] as number[],
                    num2: [] as number[],
                },
                each: {
                    operation: [] as string[],
                    num1: [] as number[]
                },
                elementaryArithmetic: {
                    operation: [] as string[],
                    num1: [] as number[]
                },
            }
        }
    },
    getters: {
        getScreenData(state) {
            return state.data;
        },
        getScreenControl(state) {
            return state.control;
        },
        getButtonControl(state) {
            return {
                accomplish: state.control.accomplish,
                setMode: state.control.setMode,
                initialMode: state.control.initialMode,
            }
        },
        getButtonList(state) {
            return state.buttonList;
        },
        getButtonData(state) {
            return { currentNum: state.data.ledOptions.values, step: state.data.step }
        },
        getStoreNum(state) {
            return state.data.storeNum;
        },
    },
    actions: {//更改当前数字后，判断是否错误以及是否完成
        changeCurrentNum(num: number) {
            //值小于100000并且不是小数
            if (num < 1000000 && !num.toString().includes(".")) {
                this.data.step--;
                this.data.ledOptions.values = num;
                this.data.ledCanvasKey++;
            } else {//数字在正确范围则更改
                this.control.ledCanvasDisplay = false;
                this.control.error = true;
            }
            //更改之后判断是否达到目标（通关）
            if (this.data.ledOptions.values === this.data.goal) {
                this.control.ledCanvasDisplay = false;
                this.control.accomplish = true;
            }

        },
        //clr的初始化
        clr() {
            this.data.ledOptions.values = this.data.initialNum;
            this.data.step = this.data.initialStep;
            this.control.ledCanvasDisplay = true;
            this.control.error = false;
            this.data.storeNum = "Store";
            this.data.ledCanvasKey--;
            if (this.buttonsControl.each.operation.length != 0) {//如果有按钮的数字则需要关卡初始化
                this.levelInit();
            }
        },
        //关卡初始化
        levelInit() {
            //存储当前关卡索引
            const level = this.data.currentLevelIndex;
            //全部初始化
            this.$reset();
            //恢复当前关卡索引
            this.data.currentLevelIndex = level;
            //获取关卡数据
            this.data.level = this.allLevelData[this.data.currentLevelIndex].level;
            this.data.initialNum = this.allLevelData[this.data.currentLevelIndex].initialNum;
            this.data.initialStep = this.allLevelData[this.data.currentLevelIndex].initialStep;
            this.data.goal = this.allLevelData[this.data.currentLevelIndex].goal;
            this.data.step = this.data.initialStep;
            this.data.ledOptions.values = this.data.initialNum;
            //添加按钮控制,遍历当前关卡的按钮
            for (const item of this.allLevelData[this.data.currentLevelIndex].buttons) {
                //不是四则运算符
                if (item[0] != '+' && item[0] != '-' && item[0] != 'x' && item[0] != '/' || item[1] === '/' || item[1] === "²" || item[1] === '³') {
                    //插入按钮 insert12
                    if (item.includes("insert")) {
                        this.buttonsControl.insert.push(Number(item.substring(6, item.length)));
                    } else if (item.includes("=>")) {//替换按钮 12=>14
                        const numArray = item.split("=>");
                        this.buttonsControl.replace.num1.push(Number(numArray[0]));
                        this.buttonsControl.replace.num2.push(Number(numArray[1]));
                    } else if (item.includes("each")) {//each 按钮 each+4
                        this.buttonsControl.each.operation.push(item.substring(4, 5));
                        this.buttonsControl.each.num1.push(Number(item.substring(5, item.length)));
                    }
                    else {//单目操作按钮
                        //如果存在则设置为true
                        if (item in this.buttonsControl) {
                            this.buttonsControl[item] = true;
                        } else {
                            console.log(item, "不存在")
                        }
                    }

                } else {//四则运算符号
                    this.buttonsControl.elementaryArithmetic.operation.push(item.substring(0, 1));
                    this.buttonsControl.elementaryArithmetic.num1.push(Number(item.substring(1, item.length)));
                }
            }
            this.changeButtonList();
        },
        //更改显示的按钮列表
        changeButtonList() {
            this.buttonList = [];
            //增加操作按钮
            for (const index in this.buttonsControl) {
                if (this.buttonsControl[index] === true) {
                    this.buttonList.push(buttonFactory(index));
                }
            }
            for (const i of this.buttonsControl.insert) {
                this.buttonList.push(buttonFactory("insert", i));
            }
            for (let i = 0; i < this.buttonsControl.replace.num1.length; i++) {
                this.buttonList.push(buttonFactory("replace", this.buttonsControl.replace.num1[i], this.buttonsControl.replace.num2[i]));
            }
            for (let i = 0; i < this.buttonsControl.each.operation.length; i++) {
                this.buttonList.push(buttonFactory("each", this.buttonsControl.each.num1[i], 0, this.buttonsControl.each.operation[i]));
            }
            for (let i = 0; i < this.buttonsControl.elementaryArithmetic.operation.length; i++) {
                this.buttonList.push(buttonFactory("elementaryArithmetic", this.buttonsControl.elementaryArithmetic.num1[i], 0, this.buttonsControl.elementaryArithmetic.operation[i]));
            }
        },
        //每个数字都操作的按钮
        eachButton(operation: string, num: number) {
            if (this.data.step > 0) {
                this.data.step--;
            }
            switch (operation) {
                case '+': {
                    for (const i in this.buttonsControl.insert) {
                        this.buttonsControl.insert[i] += num
                    }
                    for (const i in this.buttonsControl.elementaryArithmetic.num1) {
                        this.buttonsControl.elementaryArithmetic.num1[i] += num
                    }
                    break;
                } case '-': {
                    for (const i in this.buttonsControl.insert) {
                        this.buttonsControl.insert[i] -= num
                    }
                    for (const i in this.buttonsControl.elementaryArithmetic.num1) {
                        this.buttonsControl.elementaryArithmetic.num1[i] -= num
                    }
                    break;
                }
                case 'x': {
                    for (const i in this.buttonsControl.insert) {
                        this.buttonsControl.insert[i] *= num
                    }
                    for (const i in this.buttonsControl.elementaryArithmetic.num1) {
                        this.buttonsControl.elementaryArithmetic.num1[i] *= num
                    }
                    break;
                }
                case '/': {
                    for (const i in this.buttonsControl.insert) {
                        this.buttonsControl.insert[i] /= num
                    }
                    for (const i in this.buttonsControl.elementaryArithmetic.num1) {
                        this.buttonsControl.elementaryArithmetic.num1[i] /= num
                    }
                    break;
                }
            }
            this.changeButtonList();
        },
        accomplish() {
            if (this.data.currentLevelIndex < this.allLevelData.length) {
                this.data.currentLevelIndex++;
            } else {
                this.data.currentLevelIndex = 0;
            }
            this.control.accomplish = false;
            this.control.ledCanvasDisplay = true;
            this.levelInit();
        },
        changeMode() {
            if (this.control.setMode) {
                //如果是设置模式，点击就切换初始模式
                this.control.initialMode = true;
                this.control.setMode = false;
                //从设置切换到初始模式时初始化关卡
                this.levelInit();
            } else {
                this.control.setMode = true;
                this.control.initialMode = false;
            }
        },
        levelAdd() {
            if (this.data.currentLevelIndex < this.allLevelData.length - 1) {
                this.data.currentLevelIndex++;
            }
        },
        levelSub() {
            if (this.data.currentLevelIndex > 0) {
                this.data.currentLevelIndex--;
            }
        }
    }
})
