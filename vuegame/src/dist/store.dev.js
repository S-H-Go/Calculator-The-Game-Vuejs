"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vuex = require("vuex");

var rem = 16;
var store = new _vuex.createStore({
  state: {
    data: {
      level: 0,
      step: 8,
      goal: 2022,
      ledCanvasKey: 0,
      errorInfo: "ERROE",
      accomplishInfo: "完成了",
      pasueInfo: "暂停",
      rem: rem,
      ledOptions: {
        color: "#464948",
        width: 1.6 * rem,
        height: 2.6 * rem,
        values: 2021,
        lineWidth: 5,
        italics: 0,
        opacity: 0.1
      }
    },
    control: {
      ledCanvasDisplay: true,
      error: false,
      accomplish: false,
      initialMode: true,
      setMode: false
    }
  },
  getters: {
    screenData: function screenData(state) {
      return state.data;
    },
    screenControl: function screenControl(state) {
      return state.control;
    },
    buttonData: function buttonData(state) {
      return {
        currentNum: state.data.ledOptions.values,
        step: state.data.step
      };
    }
  },
  mutations: {
    changeCurrentNum: function changeCurrentNum(state, num) {
      state.data.ledOptions.values = num;
    }
  }
});
var _default = store;
exports["default"] = _default;