import { defineStore } from "pinia"
import { ILedOptions } from "./interface"
import levelData from "../assets/levelData.json"
// import levelData from "../assets/testLevelData.json"
import { ButtonControl } from "./ButtonsControl"
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
            buttonsControl: new ButtonControl()
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
            if (this.buttonsControl.getEach().operation.length != 0) {//如果有按钮的数字则需要关卡初始化
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
            //更新按钮控制
            this.buttonsControl.updateButtonsControl(this.allLevelData[this.data.currentLevelIndex].buttons);
            //更新按钮列表
            this.updateButtonList();
        },
        //更新显示的按钮列表
        updateButtonList() {
            this.buttonList = [];
            this.buttonsControl.updateButtonsList(this.buttonList);
        },
        //每个数字都操作的按钮
        eachButton(operation: string, num: number) {
            if (this.data.step > 0) {
                this.data.step--;
            }
            this.buttonsControl.eachButton(operation, num);
            this.updateButtonList();
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
