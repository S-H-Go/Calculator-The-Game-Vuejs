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
export const buttonFactory = (index, ...args) => {
    //需要加上markRaw()
    switch (index) {
      case "rightMove": {
        return { tag: markRaw(RightMoveButton) };
      }
      case "square": {
        return { tag: markRaw(SquareButton) };
      }
      case "pposite": {
        return { tag: markRaw(PpositeButton) };
      }
      case "reverse": {
        return { tag: markRaw(ReverseButton) };
      }
      case "sum": {
        return { tag: markRaw(SumButton) };
      }
      case "cube": {
        return { tag: markRaw(CubeButton) };
      }
      case "shiftLeft": {
        return { tag: markRaw(ShiftLeftButton) };
      }
      case "shiftRight": {
        return { tag: markRaw(ShiftRightButton) };
      }
      case "mirror": {
        return { tag: markRaw(MirrorButton) };
      }
      case "store": {
        return { tag: markRaw(StoreButton) };
      }
      case "inv10":{
        return {tag:markRaw(Inv10Button)};
      }
      case "insert":{
        return {tag:markRaw(InsertButton),num1:args[0]};
      }
      case "replace":{
        return {tag:markRaw(ReplaceButton),num1:args[0],num2:args[1]};
      }
      case "each":{
        return {tag:markRaw(EachButton),operation:args[0],num1:args[1]};
      }
      case "elementaryArithmetic":{
        return {tag:markRaw(ElementaryArithmetic),operation:args[0],num1:args[1]}
      }
    }
}