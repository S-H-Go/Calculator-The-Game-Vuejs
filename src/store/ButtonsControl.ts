import { buttonFactory, conversationButtonFactory, SEButtonFactory } from "./buttonFactory";
import { ILevelData } from "./interface";
//单目运算按钮枚举 single eye
export enum SEButtonEnum {
    "CLR" = "CLR",
    "set" = "set",
    "OK" = "OK",
    "empty" = "empty",
    "<<" = "<<",
    "x²" = "x²",
    "+/-" = "+/-",
    "Reverse" = "Reverse",
    "SUM" = "SUM",
    'x³' = "x³",
    'Shift<' = "Shift<",
    'Shift>' = "Shift>",
    "Mirror" = "Mirror",
    "Store" = "Store",
    "Inv10" = "Inv10",
}
export class ButtonControl {
    //关卡按钮
    private levelButtons: string[] = [];
    //更新对话按钮列表
    updateConversationButtonsList(but: ILevelData["dialogue"][0]["buttons"]) {
        let buttons = [["", "", ""], ["", "", ""], ["", "", ""]] as any[][];
        for (const item of but) {
            const i = Math.floor(item.position / 3);
            const j = Math.floor(item.position % 3);
            buttons[i][j] = conversationButtonFactory(item.info);
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (buttons[i][j] == "") {
                    buttons[i][j] = SEButtonFactory(SEButtonEnum.empty);
                }
            }
        }
        return buttons;
    }
    //更新按钮列表
    updateButtonsList(levelButtons: string[]) {
        /*
                 0   1    2
             0   00  01   02
             1   10  11   12
             2   20  21   22
        */
        //第一次的时候赋值关卡按钮
        if (this.levelButtons.length === 0) {
            for (const item of levelButtons) {
                this.levelButtons.push(item);
            }
        }
        let buttons = [["", "", ""], ["", "", ""], ["", "", ""]] as any[][];
        let iIndex = [0, 1, 1, 2, 2];
        let jIndex = [1, 1, 2, 1, 2];
        let p = 0
        buttons[0][0] = SEButtonFactory(SEButtonEnum.empty);
        buttons[1][0] = SEButtonFactory(SEButtonEnum.empty);
        buttons[2][0] = SEButtonFactory(SEButtonEnum.set);
        buttons[0][2] = SEButtonFactory(SEButtonEnum.CLR);
        for (const item of this.levelButtons) {
            //不是四则运算符
            if (item[0] != '+' && item[0] != '-' && item[0] != 'x' && item[0] != '/' || item[1] === '/' || item[1] === "²" || item[1] === '³') {
                //插入按钮 insert12
                if (item.includes("insert")) {
                    buttons[iIndex[p]][jIndex[p]] = buttonFactory("insert", Number(item.substring(6, item.length)));
                    p++;
                } else if (item.includes("=>")) {//替换按钮 12=>14
                    const numArray = item.split("=>");
                    buttons[iIndex[p]][jIndex[p]] = buttonFactory("replace", Number(numArray[0]), Number(numArray[1]));
                    p++;
                } else if (item.includes("each")) {//each 按钮 each+4
                    buttons[iIndex[p]][jIndex[p]] = buttonFactory("each", Number(item.substring(5, item.length)), 0, item.substring(4, 5));
                    p++;
                }
                else {//单目操作按钮
                    // if (this.singleEyeButtoms.has(item as SEButtonEnum)) {
                    buttons[iIndex[p]][jIndex[p]] = SEButtonFactory(item as SEButtonEnum);
                    p++;
                    // }
                }
            } else {//四则运算符号
                buttons[iIndex[p]][jIndex[p]] = buttonFactory("elementaryArithmetic", Number(item.substring(1, item.length)), 0, item.substring(0, 1));
                p++
            }
        }
        //其余位置设置为空按钮
        for (; p < iIndex.length; p++) {
            buttons[iIndex[p]][jIndex[p]] = SEButtonFactory(SEButtonEnum.empty);
        }
        return buttons;
    }
    //完成一关时按钮变换
    accomplsh(buttons: any[][]) {
        //第一列设置为空按钮
        for (let i = 0; i < buttons.length; i++) {
            buttons[i][0] = SEButtonFactory(SEButtonEnum.empty);
        }
        //将CLR按钮换成OK按钮
        buttons[0][2] = SEButtonFactory(SEButtonEnum.OK);
    }
    eachButton(operation: string, num: number) {
        switch (operation) {
            case '+': {
                for (let i in this.levelButtons) {
                    if (this.levelButtons[i].includes("insert")) {
                        this.levelButtons[i] = this.levelButtons[i].substring(0, 6) + (Number(this.levelButtons[i].substring(6, this.levelButtons[i].length)) + num);
                    }
                    if (this.levelButtons[i].charAt(0) === '+' || this.levelButtons[i].charAt(0) === '-' || this.levelButtons[i].charAt(0) === 'x' || this.levelButtons[i].charAt(0) === '/') {
                        this.levelButtons[i] = this.levelButtons[i].substring(0, 1) + (Number(this.levelButtons[i].substring(1, this.levelButtons[i].length)) + num);
                    }
                }
                break;
            } case '-': {
                for (let i in this.levelButtons) {
                    if (this.levelButtons[i].includes("insert")) {
                        this.levelButtons[i] = this.levelButtons[i].substring(0, 6) + (Number(this.levelButtons[i].substring(6, this.levelButtons[i].length)) - num);
                    }
                    if (this.levelButtons[i].charAt(0) === '+' || this.levelButtons[i].charAt(0) === '-' || this.levelButtons[i].charAt(0) === 'x' || this.levelButtons[i].charAt(0) === '/') {
                        this.levelButtons[i] = this.levelButtons[i].substring(0, 1) + (Number(this.levelButtons[i].substring(1, this.levelButtons[i].length)) - num);
                    }
                }
                break;
            }
            case 'x': {
                for (let i in this.levelButtons) {
                    if (this.levelButtons[i].includes("insert")) {
                        this.levelButtons[i] = this.levelButtons[i].substring(0, 6) + (Number(this.levelButtons[i].substring(6, this.levelButtons[i].length)) * num);
                    }
                    if (this.levelButtons[i].charAt(0) === '+' || this.levelButtons[i].charAt(0) === '-' || this.levelButtons[i].charAt(0) === 'x' || this.levelButtons[i].charAt(0) === '/') {
                        this.levelButtons[i] = this.levelButtons[i].substring(0, 1) + (Number(this.levelButtons[i].substring(1, this.levelButtons[i].length)) * num);
                    }
                }
                break;
            }
            case '/': {
                for (let i in this.levelButtons) {
                    if (this.levelButtons[i].includes("insert")) {
                        this.levelButtons[i] = this.levelButtons[i].substring(0, 6) + (Number(this.levelButtons[i].substring(6, this.levelButtons[i].length)) / num);
                    }
                    if (this.levelButtons[i].charAt(0) === '+' || this.levelButtons[i].charAt(0) === '-' || this.levelButtons[i].charAt(0) === 'x' || this.levelButtons[i].charAt(0) === '/') {
                        this.levelButtons[i] = this.levelButtons[i].substring(0, 1) + (Number(this.levelButtons[i].substring(1, this.levelButtons[i].length)) / num);
                    }
                }
                break;
            }
        }
    }
    //是否包含each按钮
    isIncludeEachButtons() {
        for (const item of this.levelButtons) {
            if (item.includes("each")) {
                return true;
            }
        }
        return false;
    }
}

