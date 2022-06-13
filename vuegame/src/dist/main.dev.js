"use strict";

var _vue = require("vue");

var _store = _interopRequireDefault(require("./store/store"));

var _App = _interopRequireDefault(require("./App.vue"));

var _levelData = _interopRequireDefault(require("./assets/levelData.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _vue.createApp)(_App["default"]);
app.use(_store["default"]);
var minLevel = 0,
    maxLevel = 0;

for (var i in _levelData["default"].level) {
  minLevel = minLevel < _levelData["default"].level[i].level ? minLevel : _levelData["default"].level[i].level;

  if (_levelData["default"].level[i].level > 0) {
    maxLevel++;
  }
}

console.log("欢迎玩这个游戏。");
_store["default"].state.data.minLevel = minLevel;
_store["default"].state.data.level = minLevel;
_store["default"].state.data.maxLevel = maxLevel;

_store["default"].commit("GET_LEVEL_DATA", _levelData["default"].level[_store["default"].state.data.level]);

_store["default"].commit("INIT");

app.mount("#app");