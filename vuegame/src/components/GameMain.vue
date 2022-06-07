<template>
  <main id="main">
    <screen-section
      :goalNumber="goalNumber"
      :step="step"
      :ledOptions="ledOptions"
      :ledNumberDisplay="ledNumberDisplay"
    ></screen-section>
    <section id="button-section">
      <div id="function-button-section">
        <button
          v-if="functionButton.clr"
          @click="clr"
          class="function-button color-clr-button"
        >
          CLR
        </button>
        <button
          v-if="functionButton.rightMove"
          @click="rightMove"
          id="right-move-button"
          class="function-button color-button-orange hide"
        >
          &lt;&lt;
        </button>
        <button
          v-if="functionButton.square"
          @click="square"
          class="function-button color-button-orange hide"
        >
          x²
        </button>
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
    initialNumber: Number,
    stepNumber: Number,
    goalNumber: Number,
  },
  components: { ScreenSection },
  data() {
    const rem = 14;
    //const initialNum = this.initialNumber;
    return {
      key: 0,
      step: this.stepNumber,
      ledNumberDisplay: true,
      error: false,
      ledOptions: {
        color: "#464948",
        width: 1.5 * rem,
        height: 2.5 * rem,
        values: this.initialNumber,
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
        reverse: false,
        sum: false,
        cube: false,
        mirror: false,
        store: false,
        inv10: false,
        insert: false,
        replace: false,
        eachOperation: false,
      },
    };
  },
  methods: {
    clr() {
      this.ledNumberDisplay = true;
      this.step = this.stepNumber;
      this.ledOptions.values = this.initialNumber;
      this.key++;
    },
    //右移
    rightMove() {
      let num = this.ledOptions.values.toString();
      if (num.length == 1 || Number(num) == 0) {
        this.ledOptions.values = 0;
        if (Number(num) == 0) {
          this.complete(false);
          return;
        }
      } else {
        this.ledOptions.values = Number(num.slice(0, num.length - 1));
      }
      this.complete();
    },
    //平方
    square() {
      if (this.ledOptions.values == 0) {
        this.complete(false);
      } else {
        this.ledOptions.values *= this.ledOptions.values;
        this.complete();
      }
    },
    complete(stepChange = true) {
      if (this.step >= 0 && stepChange) {
        this.step--;
      }
      this.key++;
      if (this.ledOptions.values === this.goalNumber) {
        this.ledNumberDisplay = false;
      }
      if (
        this.ledOptions.values > 1000000 ||
        this.ledOptions.toString().includes(".")
      ) {
        this.ledNumberDisplay = false;
        this.error = true;
      }
    },
  },
};
</script>

<style>
body {
  --rem: 14px;
  padding: 0px;
  margin: 0px;
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
