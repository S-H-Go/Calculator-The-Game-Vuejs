import { createStore } from 'vuex'
import * as type from './mutation-types'
import { buttonFactory } from "./buttonFactory"
import levelData from "../assets/levelData.json"
const rem = 16;

const store = new createStore({
    state: {
        data: {
            initialNum: 2021,
            initialStep: 8,
            level: -3,
            minLevel: 0,
            maxLevel: 0,
            step: 8,
            goal: 2022,
            ledCanvasKey: 0,
            errorInfo: "ERROE",
            accomplishInfo: "你赢了",
            pauseInfo: "暂停",
            storeNum: "Store",
            rem: rem,
            ledOptions: {
                color: "#464948",
                width: 1.6 * rem,
                height: 2.6 * rem,
                values: 2021,
                lineWidth: 5,
                italics: 0,
                opacity: 0.1,
            }
        },
        control: {
            ledCanvasDisplay: true,
            error: false,
            accomplish: false,
            initialMode: true,
            setMode: false,
        },
        buttonList: [],
        levleData:{},
        buttonControl: {
            rightMove: false,
            square: false,
            pposite: false,
            reverse: false,
            sum: false,
            cube: false,
            shiftLeft: false,
            shiftRight: false,
            mirror: false,
            store: false,
            inv10: false,
            insert: [],
            replace: [],//0和1，2和3是一组，以此类推
            each: [],//0和1，2和3是一组，0表示操作，1表示数字
            elementaryArithmetic:[]//0和1，2和3是一组，0表示操作，1表示数字
        },
    },
    getters: {
        screenData(state) {
            return state.data;
        },
        screenControl(state) {
            return state.control;
        },
        buttonControl(state) {
            return {
                accomplish: state.control.accomplish,
                setMode:state.control.setMode,
                initialMode:state.control.initialMode,
            }
        },
        buttonList(state) {
            return state.buttonList;
        },
        buttonData(state) {
            return { currentNum: state.data.ledOptions.values, step: state.data.step }
        },
        storeNum(state) {
            return state.data.storeNum;
        }
    },
    mutations: {
        [type.GET_LEVEL_DATA](state,data){
            state.levelData=data;
        },
        //更改当前数字后，判断是否错误以及是否完成
        [type.CHANGE_CURRENT_NUM](state, num) {
            state.data.ledOptions.values = num;
            state.data.ledCanvasKey++;
            if (state.data.step > 0) {
                state.data.step--;
            }
            state.data.ledCanvasKey++;
            if (state.data.ledOptions.values === state.data.goal) {
                state.control.ledCanvasDisplay = false;
                state.control.accomplish = true;
            }
            if (
                state.data.ledOptions.values > 1000000 ||
                state.data.ledOptions.values.toString().includes(".")
            ) {
                //数字过大或者是小数则报错错误
                state.control.ledCanvasDisplay = false;
                // state.data.ledOptions.values = 0; //使数值等于0，控制按钮触发后无操作
                state.control.error = true;
            }
        },
        //clr的初始化
        [type.CLR](state) {
            state.data.ledOptions.values = state.data.initialNum;
            state.data.step = state.data.initialStep;
            state.control.ledCanvasDisplay = true;
            state.control.error = false;
            state.data.storeNum="Store";
            state.data.ledCanvasKey--;
            if(state.buttonControl.each[0]){
                store.commit("INIT");
            }
        },
        //游戏全局的初始化
        [type.INIT](state){
            //初始化
            state.data.initialNum=state.levelData.initialNum,
            state.data.initialStep=state.levelData.initialStep,
            state.data.goal=state.levelData.goal;
            state.data.step=state.data.initialStep;
            state.data.storeNum="Store";
            state.data.ledOptions.values=state.data.initialNum;
            state.data.ledCanvasKey=0;
            state.control.ledCanvasDisplay=true;
            state.control.accomplish=false;
            state.control.error=false;
            state.control.initialMode=true;
            state.control.setMode=false;
            state.buttonList=[];
            for(let item in state.buttonControl){
                if(state.buttonControl[item] instanceof Array){
                    state.buttonControl[item]=[];
                }else{
                    state.buttonControl[item]=false;
                }
            }

            //添加按钮控制
            for (let item of state.levelData.buttons) {
                if (item[0] != '+' && item[0] != '-' && item[0] != 'x' && item[0] != '/') {
                    if (item.includes("insert")) {
                        state.buttonControl.insert.push(item.substring(6, item.length));
                    } else if (item.includes("=>")) {
                        let numArray=item.split("=>");
                        state.buttonControl.replace.push(numArray[0]);
                        state.buttonControl.replace.push(numArray[1]);
                    }else if(item.includes("each")){
                        state.buttonControl.each.push(item.substring(4,5));
                        state.buttonControl.each.push(item.substring(5,item.length));
                    }
                    else{
                        state.buttonControl[item] = true;
                    }

                } else {
                    state.buttonControl.elementaryArithmetic.push(item.substring(0,1));
                    state.buttonControl.elementaryArithmetic.push(item.substring(1,item.length));
                }
            }
            store.commit("CHANGE_BUTTON_LIST");
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
            for( let i=0;i<state.buttonControl.replace.length;i+=2){
                state.buttonList.push(buttonFactory("replace",Number(state.buttonControl.replace[i]),Number(state.buttonControl.replace[i+1])));
            }
            for(let i=0;i<state.buttonControl.each.length;i+=2){
                state.buttonList.push(buttonFactory("each",state.buttonControl.each[i],Number(state.buttonControl.each[i+1])));
            }
            for(let i=0;i<state.buttonControl.elementaryArithmetic.length;i+=2){
                state.buttonList.push(buttonFactory("elementaryArithmetic",state.buttonControl.elementaryArithmetic[i],Number(state.buttonControl.elementaryArithmetic[i+1])));
            }
        },
        //每个数字都操作的按钮
        [type.EACH_BUTTON](state,args){
            if(state.data.step>0){
                state.data.step--;
            }
            switch(args[0]){
                case '+':{
                    for(let i=0 ;i<state.buttonControl.insert.length;i++){
                        state.buttonControl.insert[i]=Number(state.buttonControl.insert[i])+args[1];
                    }
                    for(let i=1;i<state.buttonControl.elementaryArithmetic.length;i+=2){
                        state.buttonControl.elementaryArithmetic[i]=Number(state.buttonControl.elementaryArithmetic[i])+args[1];
                    }
                    break;
                }case '-':{
                    for(let i=0 ;i<state.buttonControl.insert.length;i++){
                        state.buttonControl.insert[i]=Number(state.buttonControl.insert[i])-args[1];
                    }
                    for(let i=1;i<state.buttonControl.elementaryArithmetic.length;i+=2){
                        state.buttonControl.elementaryArithmetic[i]=Number(state.buttonControl.elementaryArithmetic[i])-args[1];
                    }
                    break;
                }
                case 'x':{
                    for(let i=0 ;i<state.buttonControl.insert.length;i++){
                        state.buttonControl.insert[i]=Number(state.buttonControl.insert[i])*args[1];
                    }
                    for(let i=1;i<state.buttonControl.elementaryArithmetic.length;i+=2){
                        state.buttonControl.elementaryArithmetic[i]=Number(state.buttonControl.elementaryArithmetic[i])*args[1];
                    }
                    break;
                }
                case '/':{
                    for(let i=0 ;i<state.buttonControl.insert.length;i++){
                        state.buttonControl.insert[i]=Number(state.buttonControl.insert[i])/args[1];
                    }
                    for(let i=1;i<state.buttonControl.elementaryArithmetic.length;i+=2){
                        state.buttonControl.elementaryArithmetic[i]=Number(state.buttonControl.elementaryArithmetic[i])/args[1];
                    }
                    break;
                }
            }
            store.commit("CHANGE_BUTTON_LIST");
        },
        [type.ACCOMPLISH](state) {
            state.data.level++;
            state.control.accomplish = false;
            state.control.ledCanvasDisplay = true;
            store.commit("GET_LEVEL_DATA",levelData.level[state.data.level]);
            store.commit("INIT");
        },
        [type.ADD_LEVEL](state) {
            state.data.level++;
        },
        [type.SUB_LEVEL](state) {
            state.data.level--;
        }
    },

})
export default store;