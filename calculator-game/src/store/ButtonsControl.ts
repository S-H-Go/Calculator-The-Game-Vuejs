import { buttonFactory, SEButtonFactory } from "./buttonFactory";
//单目运算按钮枚举 single eye
export enum SEButtonEnum {
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
    private singleEyeButtoms = new Map(
        [
            [SEButtonEnum["<<"], false],
            [SEButtonEnum["x²"], false],
            [SEButtonEnum["+/-"], false],
            [SEButtonEnum.Reverse, false],
            [SEButtonEnum.SUM, false],
            [SEButtonEnum["x³"], false],
            [SEButtonEnum["Shift<"], false],
            [SEButtonEnum["Shift>"], false],
            [SEButtonEnum.Mirror, false],
            [SEButtonEnum.Store, false],
            [SEButtonEnum.Inv10, false],
        ]
    );
    private insert = new Array<number>();
    private replace = { num1: new Array<number>(), num2: new Array<number>() }
    private each = { operation: new Array<string>(), num1: new Array<number>() }
    private elementaryArithmetic = { operation: new Array<string>(), num1: new Array<number>() }
    //更新按钮控制数据
    updateButtonsControl(buttons: string[]) {
        for (const item of buttons) {
            //不是四则运算符
            if (item[0] != '+' && item[0] != '-' && item[0] != 'x' && item[0] != '/' || item[1] === '/' || item[1] === "²" || item[1] === '³') {
                //插入按钮 insert12
                if (item.includes("insert")) {
                    this.insert.push(Number(item.substring(6, item.length)));
                } else if (item.includes("=>")) {//替换按钮 12=>14
                    const numArray = item.split("=>");
                    this.replace.num1.push(Number(numArray[0]));
                    this.replace.num2.push(Number(numArray[1]));
                } else if (item.includes("each")) {//each 按钮 each+4
                    this.each.operation.push(item.substring(4, 5));
                    this.each.num1.push(Number(item.substring(5, item.length)));
                }
                else {//单目操作按钮
                    if (this.singleEyeButtoms.has(item as SEButtonEnum)) {
                        this.singleEyeButtoms.set(item as SEButtonEnum, true);
                    }
                }

            } else {//四则运算符号
                this.elementaryArithmetic.operation.push(item.substring(0, 1));
                this.elementaryArithmetic.num1.push(Number(item.substring(1, item.length)));
            }
        }
    }
    //更新按钮列表
    updateButtonsList(buttonList: any[]) {
        //增加操作按钮
        for (const index of this.singleEyeButtoms.keys()) {
            if (this.singleEyeButtoms.get(index) === true) {
                buttonList.push(SEButtonFactory(index));
            }
        }
        for (const i of this.insert) {
            buttonList.push(buttonFactory("insert", i));
        }
        for (let i = 0; i < this.replace.num1.length; i++) {
            buttonList.push(buttonFactory("replace", this.replace.num1[i], this.replace.num2[i]));
        }
        for (let i = 0; i < this.each.operation.length; i++) {
            buttonList.push(buttonFactory("each", this.each.num1[i], 0, this.each.operation[i]));
        }
        for (let i = 0; i < this.elementaryArithmetic.operation.length; i++) {
            buttonList.push(buttonFactory("elementaryArithmetic", this.elementaryArithmetic.num1[i], 0, this.elementaryArithmetic.operation[i]));
        }
    }
    eachButton(operation: string, num: number) {
        switch (operation) {
            case '+': {
                for (const i in this.insert) {
                    this.insert[i] += num
                }
                for (const i in this.elementaryArithmetic.num1) {
                    this.elementaryArithmetic.num1[i] += num
                }
                break;
            } case '-': {
                for (const i in this.insert) {
                    this.insert[i] -= num
                }
                for (const i in this.elementaryArithmetic.num1) {
                    this.elementaryArithmetic.num1[i] -= num
                }
                break;
            }
            case 'x': {
                for (const i in this.insert) {
                    this.insert[i] *= num
                }
                for (const i in this.elementaryArithmetic.num1) {
                    this.elementaryArithmetic.num1[i] *= num
                }
                break;
            }
            case '/': {
                for (const i in this.insert) {
                    this.insert[i] /= num
                }
                for (const i in this.elementaryArithmetic.num1) {
                    this.elementaryArithmetic.num1[i] /= num
                }
                break;
            }
        }
    }

    getEach() {
        return this.each;
    }
}
