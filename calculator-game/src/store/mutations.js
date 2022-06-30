import * as type from "./mutation-types"
import { buttonFactory } from "./buttonFactory"

let mutations = {
    //更改当前数字后，判断是否错误以及是否完成
    [type.CHANGE_CURRENT_NUM](state, num) {
        //步数大于0，并且值小于100000并且不是小数
        if (state.data.step > 0 && num < 1000000 && !num.toString().includes(".")) {
            state.data.step--;
            state.data.ledOptions.values = num;
            state.data.ledCanvasKey++;
        } else {//数字在正确范围则更改
            state.control.ledCanvasDisplay = false;
            state.control.error = true;
        }
        //更改之后判断是否达到目标（通关）
        if (state.data.ledOptions.values === state.data.goal) {
            state.control.ledCanvasDisplay = false;
            state.control.accomplish = true;
        }

    },
    //clr的初始化
    [type.CLR](state) {
        state.data.ledOptions.values = state.data.initialNum;
        state.data.step = state.data.initialStep;
        state.control.ledCanvasDisplay = true;
        state.control.error = false;
        state.data.storeNum = "Store";
        state.data.ledCanvasKey--;
        if (state.buttonControl.each[0]) {//如果有按钮的数字则需要关卡初始化
            this.commit(type.LEVEL_INIT);
        }
    },
    //游戏全局的初始化
    [type.OVERALL_INIT](state, levelData) {
        //初始化
        state.allLevelData = levelData;
        state.data.currentLevelIndex = 0;
        state.data.accomplishInfo = "你赢了";
        state.data.errorInfo = "错误";
        state.data.pauseInfo = "暂停";
        this.commit(type.LEVEL_INIT);
    },
    //当前关卡初始化
    [type.LEVEL_INIT](state) {
        //控制数据
        state.control.ledCanvasDisplay = true;
        state.control.accomplish = false;
        state.control.error = false;
        state.control.initialMode = true;
        state.control.setMode = false;
        //关卡数据
        state.data.level = state.allLevelData[state.data.currentLevelIndex].level;
        state.data.initialNum = state.allLevelData[state.data.currentLevelIndex].initialNum;
        state.data.initialStep = state.allLevelData[state.data.currentLevelIndex].initialStep;
        state.data.goal = state.allLevelData[state.data.currentLevelIndex].goal;
        state.data.step = state.data.initialStep;
        state.data.storeNum = "Store";
        state.data.ledOptions.values = state.data.initialNum;
        state.data.ledCanvasKey = 0;
        state.buttonList = [];

        for (let item in state.buttonControl) {
            if (state.buttonControl[item] instanceof Array) {
                state.buttonControl[item] = [];
            } else {
                state.buttonControl[item] = false;
            }
        }
        //添加按钮控制
        for (let item of state.allLevelData[state.data.currentLevelIndex].buttons) {
            if (item[0] != '+' && item[0] != '-' && item[0] != 'x' && item[0] != '/' && item[1] != "²") {
                if (item.includes("insert")) {
                    state.buttonControl.insert.push(item.substring(6, item.length));
                } else if (item.includes("=>")) {
                    let numArray = item.split("=>");
                    state.buttonControl.replace.push(numArray[0]);
                    state.buttonControl.replace.push(numArray[1]);
                } else if (item.includes("each")) {
                    state.buttonControl.each.push(item.substring(4, 5));
                    state.buttonControl.each.push(item.substring(5, item.length));
                }
                else {
                    state.buttonControl[item] = true;
                }

            } else {
                //将x平方和立方从四则运算中排除
                if (item[1] === "²" || item[1] === "³" || item[1] === "/") {
                    state.buttonControl[item] = true;
                } else {
                    state.buttonControl.elementaryArithmetic.push(item.substring(0, 1));
                    state.buttonControl.elementaryArithmetic.push(item.substring(1, item.length));
                }
            }
        }
        this.commit(type.CHANGE_BUTTON_LIST);
    },
    //更改显示的按钮列表
    [type.CHANGE_BUTTON_LIST](state) {
        state.buttonList = [];
        //增加操作按钮
        for (let index in state.buttonControl) {
            if (state.buttonControl[index] === true) {
                state.buttonList.push(buttonFactory(index));
            }
        }
        for (let i of state.buttonControl.insert) {
            state.buttonList.push(buttonFactory("insert", i));
        }
        for (let i = 0; i < state.buttonControl.replace.length; i += 2) {
            state.buttonList.push(buttonFactory("replace", Number(state.buttonControl.replace[i]), Number(state.buttonControl.replace[i + 1])));
        }
        for (let i = 0; i < state.buttonControl.each.length; i += 2) {
            state.buttonList.push(buttonFactory("each", state.buttonControl.each[i], Number(state.buttonControl.each[i + 1])));
        }
        for (let i = 0; i < state.buttonControl.elementaryArithmetic.length; i += 2) {
            state.buttonList.push(buttonFactory("elementaryArithmetic", state.buttonControl.elementaryArithmetic[i], Number(state.buttonControl.elementaryArithmetic[i + 1])));
        }
    },
    //每个数字都操作的按钮
    [type.EACH_BUTTON](state, args) {
        if (state.data.step > 0) {
            state.data.step--;
        }
        switch (args[0]) {
            case '+': {
                for (let i = 0; i < state.buttonControl.insert.length; i++) {
                    state.buttonControl.insert[i] = Number(state.buttonControl.insert[i]) + args[1];
                }
                for (let i = 1; i < state.buttonControl.elementaryArithmetic.length; i += 2) {
                    state.buttonControl.elementaryArithmetic[i] = Number(state.buttonControl.elementaryArithmetic[i]) + args[1];
                }
                break;
            } case '-': {
                for (let i = 0; i < state.buttonControl.insert.length; i++) {
                    state.buttonControl.insert[i] = Number(state.buttonControl.insert[i]) - args[1];
                }
                for (let i = 1; i < state.buttonControl.elementaryArithmetic.length; i += 2) {
                    state.buttonControl.elementaryArithmetic[i] = Number(state.buttonControl.elementaryArithmetic[i]) - args[1];
                }
                break;
            }
            case 'x': {
                for (let i = 0; i < state.buttonControl.insert.length; i++) {
                    state.buttonControl.insert[i] = Number(state.buttonControl.insert[i]) * args[1];
                }
                for (let i = 1; i < state.buttonControl.elementaryArithmetic.length; i += 2) {
                    state.buttonControl.elementaryArithmetic[i] = Number(state.buttonControl.elementaryArithmetic[i]) * args[1];
                }
                break;
            }
            case '/': {
                for (let i = 0; i < state.buttonControl.insert.length; i++) {
                    state.buttonControl.insert[i] = Number(state.buttonControl.insert[i]) / args[1];
                }
                for (let i = 1; i < state.buttonControl.elementaryArithmetic.length; i += 2) {
                    state.buttonControl.elementaryArithmetic[i] = Number(state.buttonControl.elementaryArithmetic[i]) / args[1];
                }
                break;
            }
        }
        this.commit(type.CHANGE_BUTTON_LIST);
    },
    [type.ACCOMPLISH](state) {
        if (state.data.currentLevelIndex < state.allLevelData.length) {
            state.data.currentLevelIndex++;
        } else {
            state.data.currentLevelIndex = 0;
        }
        state.control.accomplish = false;
        state.control.ledCanvasDisplay = true;
        this.commit(type.LEVEL_INIT);
    },
    [type.CHANGE_MODE](state) {
        if (state.control.setMode) {
            //如果是设置模式，点击就切换初始模式
            state.control.initialMode = true;
            state.control.setMode = false;
            //从设置切换到初始模式时初始化关卡
            this.commit(type.LEVEL_INIT);
        } else {
            state.control.setMode = true;
            state.control.initialMode = false;
        }
    },
    [type.LEVEL_ADD](state) {
        if (state.data.currentLevelIndex < state.allLevelData.length - 1) {
            state.data.currentLevelIndex++;
        }
    },
    [type.LEVEL_SUB](state) {
        if (state.data.currentLevelIndex > 0) {
            state.data.currentLevelIndex--;
        }
    }
}

export default mutations;