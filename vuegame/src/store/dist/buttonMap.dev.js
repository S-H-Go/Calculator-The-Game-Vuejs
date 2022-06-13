"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buttonMap = void 0;

var _RightButton = _interopRequireDefault(require("../components/functionButton/RightButton.vue"));

var _vue = require("vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var buttonMap = {
  rightMove: (0, _vue.markRaw)(_RightButton["default"]),
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
  replace: false,
  eachOperation: false
};
exports.buttonMap = buttonMap;