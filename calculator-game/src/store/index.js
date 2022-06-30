import { createStore } from 'vuex'
import mutations from './mutations';
const store = new createStore({
    state: {
        data: {
            //全局数据
            currentLevelIndex: 0,
            errorInfo: "错误",
            accomplishInfo: "你赢了",
            pauseInfo: "暂停",
            //当前关卡数据
            level: 0,
            initialNum: 0,
            initialStep: 0,
            step: 0,
            goal: 0,
            storeNum: "Store",
            ledCanvasKey: 0,
            ledOptions: {
                color: "#464948",
                width: 36,
                height: 60,
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
        allLevelData: [],
        buttonControl: {
            ">>": false,
            "x²": false,
            "+/-": false,
            "Reverse": false,
            "SUM": false,
            "x³": false,
            "Shift>": false,
            "Shift<": false,
            "Mirror": false,
            "Store": false,
            "Inv10": false,
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
            elementaryArithmetic: []//0和1，2和3是一组，0表示操作，1表示数字
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
                setMode: state.control.setMode,
                initialMode: state.control.initialMode,
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
        },
    },
    mutations: mutations,

})
export default store;