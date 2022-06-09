<template>
  <main id="main">
    <screen-section
      :info="displayInfo"
      :control="displayControl"
      :ledOptions="ledOptions"
    ></screen-section>
    <section id="button-section">
      <div id="other-button-section"></div>
      <div id="function-button-section">
        <clr-button
          v-show="functionButton.clr"
          @init="init"
          class="function-button color-clr-button"
        ></clr-button>
        <right-move-button
          :info="getInfo()"
          @changeCurrentNum="changeCurrentNum"
          class="function-button color-button-orange"
        ></right-move-button>
        <square-button
          :info="getInfo()"
          @changeCurrentNum="changeCurrentNum"
          class="function-button color-button-orange"
        ></square-button>
        <button
          v-if="functionButton.pposite"
          id="pposite-nubutton"
          class="function-button color-button-orange hide"
        >
          +/-
        </button>
        <button
          v-if="functionButton.shiftLeft"
          id="shift-rightmber-button"
          class="function-button color-button-orange hide"
        >
          Shift&lt;
        </button>
        <button
          v-if="functionButton.shiftRight"
          id="shift-left--button"
          class="function-button color-button-orange hide"
        >
          Shift&gt;
        </button>
        <button
          v-if="functionButton.reverse"
          id="reverse-button"
          class="function-button color-button-orange hide"
        >
          Reverse
        </button>
        <button
          v-if="functionButton.sum"
          id="sum-button"
          class="function-button color-button-orange hide"
        >
          SUM
        </button>
        <button
          v-if="functionButton.cube"
          id="cube-button"
          class="function-button color-button-orange hide"
        >
          x³
        </button>

        <button
          v-if="functionButton.mirror"
          id="mirror-button"
          class="function-button color-button-orange hide"
        >
          Mirror
        </button>
        <button
          v-if="functionButton.store"
          id="store-button"
          class="function-button color-button-purple hide"
        >
          Store
        </button>
        <button
          v-if="functionButton.inv10"
          id="inv10-button"
          class="function-button color-button-orange hide"
        >
          Inv10
        </button>
        <button
          v-if="functionButton.insert"
          id="insert-button"
          class="function-button color-button-blue hide"
        >
          7
        </button>
        <button
          v-if="functionButton.replace"
          id="replace-button"
          class="function-button color-button-orange hide"
        >
          3=&gt;25
        </button>
        <button
          v-if="functionButton.eachOperation"
          id="each-operation-button"
          class="function-button hide"
        >
          [+1]
        </button>
      </div>
    </section>
  </main>
</template>

<script>
import ScreenSection from "./ScreenSection.vue";
import ClrButton from "./ClrButton.vue";
import RightMoveButton from "./RightMoveButton.vue";
import SquareButton from "./SquareButton.vue";
//const rem = 14;
// let ledOptions = {
//   color: "#464948",
//   width: 1.5 * rem,
//   height: 2.5 * rem,
//   values: 0,
//   lineWidth: 5,
//   italics: 0,
//   opacity: 0.1,
// };
export default {
  name: "GameMain",
  props: {
    level: Number,
    initialNum: Number,
    initialStep: Number,
    goal: Number,
  },
  components: { ScreenSection, ClrButton, RightMoveButton, SquareButton },
  data() {
    const rem = 16;
    //const initialNum = this.initialNumber;
    return {
      displayInfo: {
        level: this.level,
        step: this.initialStep,
        goal: this.goal,
        ledCanvasKey: 0,
        errorInfo: "ERROE",
        accomplishInfo: "完成了",
      },
      displayControl: {
        ledCanvasDisplay: true,
        error: false,
        accomplish: false,
        pause: false,
      },
      ledOptions: {
        color: "#464948",
        width: 1.6 * rem,
        height: 2.6 * rem,
        values: this.initialNum,
        lineWidth: 5,
        italics: 0,
        opacity: 0.1,
      },
      functionButton: {
        clr: true, //重置为初始值
        rightMove: true, //右移
        square: true,
        pposite: true,
        shiftRight: true,
        shiftLeft: true,
        reverse: true,
        sum: true,
        cube: true,
        mirror: true,
        store: true,
        inv10: true,
        insert: true,
        replace: true,
        eachOperation: false,
      },
    };
  },
  methods: {
    //右移
    // rightMove() {
    //   let num = this.ledOptions.values.toString();
    //   if (num.length == 1 || Number(num) == 0) {
    //     this.ledOptions.values = 0;
    //     if (Number(num) == 0) {
    //       this.complete(false);
    //       return;
    //     }
    //   } else {
    //     this.ledOptions.values = Number(num.slice(0, num.length - 1));
    //   }
    //   this.complete();
    // },
    //平方
    complete: function (stepChange = true) {
      if (this.displayInfo.step >= 0 && stepChange) {
        this.displayInfo.step--;
      }
      this.ledCanvasKey++;
      if (this.ledOptions.values === this.goal) {
        this.ledNumberDisplay = false;
      }
      if (
        this.ledOptions.values > 1000000 ||
        this.ledOptions.toString().includes(".")
      ) {
        this.displayControl.ledCanvasDisplay = false;
        this.displayControl.error = true;
      }
    },
    //获取当前信息，传递给按钮子组件
    getInfo: function () {
      return {
        currentNum: this.ledOptions.values,
        step: this.displayInfo.step,
      };
    },
    //更改当前数字
    changeCurrentNum: function (num) {
      this.ledOptions.values = num;
      this.displayInfo.ledCanvasKey++;
      this.complete();
    },
    init: function () {
      this.ledOptions.values = this.initialNum;
      this.displayInfo.step = this.initialStep;
      this.displayInfo.ledCanvasKey--;
      this.displayControl.error = false;
      this.displayControl.ledCanvasDisplay = true;
    },
  },
};
</script>

<style>
body {
  --rem: 16px;
  padding: 0px;
  margin: 0px;
  border: 0px;
  font-family: "Microsoft Yahei", simSun, Arial;
  font-size: var(--rem);
}
#main {
  height: 30rem;
  width: 15rem;
  margin: auto;
}
.color-clr-button {
  background-color: #c72f2e;
  box-shadow: 0rem 0.4rem hsl(0, 62%, 41%);
}
.color-button-blue {
  background-color: #8b7cd6;
  box-shadow: 0rem 0.4rem hsl(250, 52%, 59%);
}
.color-button-grey {
  background-color: #424a4c;
  box-shadow: 0rem 0.4rem hsl(192, 7%, 21%);
}
.color-button-orange {
  background-color: #ea6c18;
  box-shadow: 0rem 0.4rem hsl(24, 83%, 44%);
}
.color-button-purple {
  background-color: #5c215b;
  box-shadow: 0rem 0.4rem hsl(301, 47%, 18%);
}
#button-section {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 0%;
}
#function-button-section {
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  margin: 0rem;
  padding-top: 0rem;
}

.function-button {
  border: none;
  color: white;
  border-radius: 6%;
  margin: 0.3rem 0.1rem;
  width: 4.8rem;
  height: 4rem;
}
</style>
