"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vuex = require("vuex");

var type = _interopRequireWildcard(require("./mutation-types"));

var _buttonFactory = require("./buttonFactory");

var _levelData = _interopRequireDefault(require("../assets/levelData.json"));

var _mutations;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var rem = 16;
var store = new _vuex.createStore({
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
        opacity: 0.1
      }
    },
    control: {
      ledCanvasDisplay: true,
      error: false,
      accomplish: false,
      initialMode: true,
      setMode: false
    },
    buttonList: [],
    levleData: {},
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
      replace: [],
      //0和1，2和3是一组，以此类推
      each: [],
      //0和1，2和3是一组，0表示操作，1表示数字
      elementaryArithmetic: [] //0和1，2和3是一组，0表示操作，1表示数字

    }
  },
  getters: {
    screenData: function screenData(state) {
      return state.data;
    },
    screenControl: function screenControl(state) {
      return state.control;
    },
    buttonControl: function buttonControl(state) {
      return {
        accomplish: state.control.accomplish,
        setMode: state.control.setMode,
        initialMode: state.control.initialMode
      };
    },
    buttonList: function buttonList(state) {
      return state.buttonList;
    },
    buttonData: function buttonData(state) {
      return {
        currentNum: state.data.ledOptions.values,
        step: state.data.step
      };
    },
    storeNum: function storeNum(state) {
      return state.data.storeNum;
    }
  },
  mutations: (_mutations = {}, _defineProperty(_mutations, type.GET_LEVEL_DATA, function (state, data) {
    state.levelData = data;
  }), _defineProperty(_mutations, type.CHANGE_CURRENT_NUM, function (state, num) {
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

    if (state.data.ledOptions.values > 1000000 || state.data.ledOptions.values.toString().includes(".")) {
      //数字过大或者是小数则报错
      state.control.ledCanvasDisplay = false;
      state.control.error = true;
    }
  }), _defineProperty(_mutations, type.CLR, function (state) {
    state.data.ledOptions.values = state.data.initialNum;
    state.data.step = state.data.initialStep;
    state.control.ledCanvasDisplay = true;
    state.control.error = false;
    state.data.storeNum = "Store";
    state.data.ledCanvasKey--;

    if (state.buttonControl.each[0]) {
      store.commit("INIT");
    }
  }), _defineProperty(_mutations, type.INIT, function (state) {
    //初始化
    state.data.initialNum = state.levelData.initialNum, state.data.initialStep = state.levelData.initialStep, state.data.goal = state.levelData.goal;
    state.data.step = state.data.initialStep;
    state.data.storeNum = "Store";
    state.data.ledOptions.values = state.data.initialNum;
    state.data.ledCanvasKey = 0;
    state.control.ledCanvasDisplay = true;
    state.control.accomplish = false;
    state.control.error = false;
    state.control.initialMode = true;
    state.control.setMode = false;
    state.buttonList = [];

    for (var item in state.buttonControl) {
      if (state.buttonControl[item] instanceof Array) {
        state.buttonControl[item] = [];
      } else {
        state.buttonControl[item] = false;
      }
    } //添加按钮控制


    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = state.levelData.buttons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _item = _step.value;

        if (_item[0] != '+' && _item[0] != '-' && _item[0] != 'x' && _item[0] != '/') {
          if (_item.includes("insert")) {
            state.buttonControl.insert.push(_item.substring(6, _item.length));
          } else if (_item.includes("=>")) {
            var numArray = _item.split("=>");

            state.buttonControl.replace.push(numArray[0]);
            state.buttonControl.replace.push(numArray[1]);
          } else if (_item.includes("each")) {
            state.buttonControl.each.push(_item.substring(4, 5));
            state.buttonControl.each.push(_item.substring(5, _item.length));
          } else {
            state.buttonControl[_item] = true;
          }
        } else {
          state.buttonControl.elementaryArithmetic.push(_item.substring(0, 1));
          state.buttonControl.elementaryArithmetic.push(_item.substring(1, _item.length));
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    store.commit("CHANGE_BUTTON_LIST");
  }), _defineProperty(_mutations, type.CHANGE_BUTTON_LIST, function (state) {
    state.buttonList = []; //增加操作按钮

    for (var index in state.buttonControl) {
      if (state.buttonControl[index] === true) {
        state.buttonList.push((0, _buttonFactory.buttonFactory)(index));
      }
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = state.buttonControl.insert[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _i3 = _step2.value;
        state.buttonList.push((0, _buttonFactory.buttonFactory)("insert", _i3));
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    for (var i = 0; i < state.buttonControl.replace.length; i += 2) {
      state.buttonList.push((0, _buttonFactory.buttonFactory)("replace", Number(state.buttonControl.replace[i]), Number(state.buttonControl.replace[i + 1])));
    }

    for (var _i = 0; _i < state.buttonControl.each.length; _i += 2) {
      state.buttonList.push((0, _buttonFactory.buttonFactory)("each", state.buttonControl.each[_i], Number(state.buttonControl.each[_i + 1])));
    }

    for (var _i2 = 0; _i2 < state.buttonControl.elementaryArithmetic.length; _i2 += 2) {
      state.buttonList.push((0, _buttonFactory.buttonFactory)("elementaryArithmetic", state.buttonControl.elementaryArithmetic[_i2], Number(state.buttonControl.elementaryArithmetic[_i2 + 1])));
    }
  }), _defineProperty(_mutations, type.EACH_BUTTON, function (state, args) {
    if (state.data.step > 0) {
      state.data.step--;
    }

    switch (args[0]) {
      case '+':
        {
          for (var i = 0; i < state.buttonControl.insert.length; i++) {
            state.buttonControl.insert[i] = Number(state.buttonControl.insert[i]) + args[1];
          }

          for (var _i4 = 1; _i4 < state.buttonControl.elementaryArithmetic.length; _i4 += 2) {
            state.buttonControl.elementaryArithmetic[_i4] = Number(state.buttonControl.elementaryArithmetic[_i4]) + args[1];
          }

          break;
        }

      case '-':
        {
          for (var _i5 = 0; _i5 < state.buttonControl.insert.length; _i5++) {
            state.buttonControl.insert[_i5] = Number(state.buttonControl.insert[_i5]) - args[1];
          }

          for (var _i6 = 1; _i6 < state.buttonControl.elementaryArithmetic.length; _i6 += 2) {
            state.buttonControl.elementaryArithmetic[_i6] = Number(state.buttonControl.elementaryArithmetic[_i6]) - args[1];
          }

          break;
        }

      case 'x':
        {
          for (var _i7 = 0; _i7 < state.buttonControl.insert.length; _i7++) {
            state.buttonControl.insert[_i7] = Number(state.buttonControl.insert[_i7]) * args[1];
          }

          for (var _i8 = 1; _i8 < state.buttonControl.elementaryArithmetic.length; _i8 += 2) {
            state.buttonControl.elementaryArithmetic[_i8] = Number(state.buttonControl.elementaryArithmetic[_i8]) * args[1];
          }

          break;
        }

      case '/':
        {
          for (var _i9 = 0; _i9 < state.buttonControl.insert.length; _i9++) {
            state.buttonControl.insert[_i9] = Number(state.buttonControl.insert[_i9]) / args[1];
          }

          for (var _i10 = 1; _i10 < state.buttonControl.elementaryArithmetic.length; _i10 += 2) {
            state.buttonControl.elementaryArithmetic[_i10] = Number(state.buttonControl.elementaryArithmetic[_i10]) / args[1];
          }

          break;
        }
    }

    store.commit("CHANGE_BUTTON_LIST");
  }), _defineProperty(_mutations, type.ACCOMPLISH, function (state) {
    if (state.data.level < state.data.maxLevel) {
      state.data.level++;
    } else {
      state.data.level == state.data.minLevel;
    }

    state.control.accomplish = false;
    state.control.ledCanvasDisplay = true;
    store.commit("GET_LEVEL_DATA", _levelData["default"].level[state.data.level]);
    store.commit("INIT");
  }), _defineProperty(_mutations, type.ADD_LEVEL, function (state) {
    state.data.level++;
  }), _defineProperty(_mutations, type.SUB_LEVEL, function (state) {
    state.data.level--;
  }), _mutations)
});
var _default = store;
exports["default"] = _default;