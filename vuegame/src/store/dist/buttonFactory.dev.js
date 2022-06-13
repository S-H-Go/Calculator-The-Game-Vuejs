"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buttonFactory = void 0;

var _RightMoveButton = _interopRequireDefault(require("../components/functionButton/RightMoveButton.vue"));

var _SquareButton = _interopRequireDefault(require("../components/functionButton/SquareButton.vue"));

var _PpositeButton = _interopRequireDefault(require("../components/functionButton/PpositeButton.vue"));

var _ReverseButton = _interopRequireDefault(require("../components/functionButton/ReverseButton.vue"));

var _SumButton = _interopRequireDefault(require("../components/functionButton/SumButton.vue"));

var _CubeButton = _interopRequireDefault(require("../components/functionButton/CubeButton.vue"));

var _ShiftLeftButton = _interopRequireDefault(require("../components/functionButton/ShiftLeftButton.vue"));

var _ShiftRightButton = _interopRequireDefault(require("../components/functionButton/ShiftRightButton.vue"));

var _MirrorButton = _interopRequireDefault(require("../components/functionButton/MirrorButton.vue"));

var _StoreButton = _interopRequireDefault(require("../components/functionButton/StoreButton.vue"));

var _Inv10Button = _interopRequireDefault(require("../components/functionButton/Inv10Button.vue"));

var _InsertButton = _interopRequireDefault(require("../components/functionButton/InsertButton.vue"));

var _ReplaceButton = _interopRequireDefault(require("../components/functionButton/ReplaceButton.vue"));

var _EachButton = _interopRequireDefault(require("../components/functionButton/EachButton.vue"));

var _ElementaryArithmetic = _interopRequireDefault(require("../components/functionButton/ElementaryArithmetic.vue"));

var _vue = require("vue");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var buttonFactory = function buttonFactory(index) {
  //需要加上markRaw()
  switch (index) {
    case "rightMove":
      {
        return {
          tag: (0, _vue.markRaw)(_RightMoveButton["default"])
        };
      }

    case "square":
      {
        return {
          tag: (0, _vue.markRaw)(_SquareButton["default"])
        };
      }

    case "pposite":
      {
        return {
          tag: (0, _vue.markRaw)(_PpositeButton["default"])
        };
      }

    case "reverse":
      {
        return {
          tag: (0, _vue.markRaw)(_ReverseButton["default"])
        };
      }

    case "sum":
      {
        return {
          tag: (0, _vue.markRaw)(_SumButton["default"])
        };
      }

    case "cube":
      {
        return {
          tag: (0, _vue.markRaw)(_CubeButton["default"])
        };
      }

    case "shiftLeft":
      {
        return {
          tag: (0, _vue.markRaw)(_ShiftLeftButton["default"])
        };
      }

    case "shiftRight":
      {
        return {
          tag: (0, _vue.markRaw)(_ShiftRightButton["default"])
        };
      }

    case "mirror":
      {
        return {
          tag: (0, _vue.markRaw)(_MirrorButton["default"])
        };
      }

    case "store":
      {
        return {
          tag: (0, _vue.markRaw)(_StoreButton["default"])
        };
      }

    case "inv10":
      {
        return {
          tag: (0, _vue.markRaw)(_Inv10Button["default"])
        };
      }

    case "insert":
      {
        return {
          tag: (0, _vue.markRaw)(_InsertButton["default"]),
          num1: arguments.length <= 1 ? undefined : arguments[1]
        };
      }

    case "replace":
      {
        return {
          tag: (0, _vue.markRaw)(_ReplaceButton["default"]),
          num1: arguments.length <= 1 ? undefined : arguments[1],
          num2: arguments.length <= 2 ? undefined : arguments[2]
        };
      }

    case "each":
      {
        return {
          tag: (0, _vue.markRaw)(_EachButton["default"]),
          operation: arguments.length <= 1 ? undefined : arguments[1],
          num1: arguments.length <= 2 ? undefined : arguments[2]
        };
      }

    case "elementaryArithmetic":
      {
        return {
          tag: (0, _vue.markRaw)(_ElementaryArithmetic["default"]),
          operation: arguments.length <= 1 ? undefined : arguments[1],
          num1: arguments.length <= 2 ? undefined : arguments[2]
        };
      }
  }
};

exports.buttonFactory = buttonFactory;