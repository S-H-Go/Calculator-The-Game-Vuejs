import ConversationButton from "../components/otherButtons/ConversationButton.vue";
import ClrButton from "../components/functionButton/ClrButton.vue";
import SetButton from "../components/setButton/SetButton.vue";
import EmptyButton from "../components/otherButtons/EmptyButton.vue";
import OkButton from "../components/functionButton/OkButton.vue";
import RightMoveButton from "../components/functionButton/RightMoveButton.vue";
import SquareButton from "../components/functionButton/SquareButton.vue";
import PpositeButton from "../components/functionButton/PpositeButton.vue";
import ReverseButton from "../components/functionButton/ReverseButton.vue";
import SumButton from "../components/functionButton/SumButton.vue";
import CubeButton from "../components/functionButton/CubeButton.vue";
import ShiftLeftButton from "../components/functionButton/ShiftLeftButton.vue";
import ShiftRightButton from "../components/functionButton/ShiftRightButton.vue";
import MirrorButton from "../components/functionButton/MirrorButton.vue";
import StoreButton from "../components/functionButton/StoreButton.vue";
import Inv10Button from "../components/functionButton/Inv10Button.vue";


import InsertButton from "../components/functionButton/InsertButton.vue";
import ReplaceButton from "../components/functionButton/ReplaceButton.vue";
import EachButton from "../components/functionButton/EachButton.vue";
import ElementaryArithmetic from "../components/functionButton/ElementaryArithmetic.vue"
import { markRaw } from "vue";
import { SEButtonEnum } from "./ButtonsControl";

const clrButton = { tag: markRaw(ClrButton) };
const setButton = { tag: markRaw(SetButton) };
const emptyButton = { tag: markRaw(EmptyButton) };
const okButton = { tag: markRaw(OkButton) };
const rightMoveButton = { tag: markRaw(RightMoveButton) };
const squareButton = { tag: markRaw(SquareButton) };
const ppositeButton = { tag: markRaw(PpositeButton) };
const reverseButton = { tag: markRaw(ReverseButton) };
const sumButton = { tag: markRaw(SumButton) };
const cubeButton = { tag: markRaw(CubeButton) };
const shiftLeftButton = { tag: markRaw(ShiftLeftButton) };
const shiftRightButton = { tag: markRaw(ShiftRightButton) };
const mirrorButton = { tag: markRaw(MirrorButton) };
const storeButton = { tag: markRaw(StoreButton) };
const inv10Button = { tag: markRaw(Inv10Button) };

export function SEButtonFactory(index: SEButtonEnum) {
  //需要加上markRaw()
  switch (index) {
    case SEButtonEnum.CLR: {
      return clrButton;
    }
    case SEButtonEnum.set: {
      return setButton;
    }
    case SEButtonEnum.empty: {
      return emptyButton;
    }
    case SEButtonEnum.OK: {
      return okButton;
    }
    case "<<": {
      return rightMoveButton;
    }
    case "x²": {
      return squareButton;
    }
    case "+/-": {
      return ppositeButton;
    }
    case "Reverse": {
      return reverseButton;
    }
    case "SUM": {
      return sumButton;
    }
    case "x³": {
      return cubeButton;
    }
    case "Shift>": {
      return shiftLeftButton;
    }
    case "Shift<": {
      return shiftRightButton;
    }
    case "Mirror": {
      return mirrorButton;
    }
    case "Store": {
      return storeButton;
    }
    case "Inv10": {
      return inv10Button;
    }
  }
}

export function buttonFactory(index: string, num1?: number, num2?: number, operation?: string) {
  switch (index) {
    case "insert": {
      return { tag: markRaw(InsertButton), num1: num1 };
    }
    case "replace": {
      return { tag: markRaw(ReplaceButton), num1: num1, num2: num2 };
    }
    case "each": {
      return { tag: markRaw(EachButton), operation: operation, num1: num1 };
    }
    case "elementaryArithmetic": {
      return { tag: markRaw(ElementaryArithmetic), operation: operation, num1: num1 }
    }
  }
}
export function conversationButtonFactory(info: string) {
  return { tag: markRaw(ConversationButton), info: info }
}
