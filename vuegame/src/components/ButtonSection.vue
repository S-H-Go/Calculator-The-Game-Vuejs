<template>
  <div id="button-section">
    <div
      id="set-button-section"
      v-show="buttonControl.setMode && !buttonControl.initialMode"
    >
      <set-button></set-button>
    </div>
    <div
      id="other-button-section"
      v-show="buttonControl.initialMode && !buttonControl.setMode"
    >
      <set-button></set-button>
    </div>
    <div
      id="function-button-section"
      v-show="buttonControl.initialMode && !buttonControl.setMode"
    >
      <ok-button v-show="buttonControl.accomplish"></ok-button>
      <clr-button v-show="!buttonControl.accomplish" @init="init"></clr-button>
      <component
        :is="item.tag"
        v-for="item of buttonList"
        :key="item.id"
        :currentNum="buttonData.currentNum"
        :step="buttonData.step"
        @changeCurrentNum="changeCurrentNum"
        :operation="item.operation ? item.operation : null"
        :num1="item.num1 ? item.num1 : null"
        :num2="item.num2 ? item.num2 : null"
      ></component>
    </div>
  </div>
</template>

<script>
import ClrButton from "./functionButton/ClrButton.vue";
import { mapGetters, mapMutations } from "vuex";
import OkButton from "./functionButton/OkButton.vue";
import SetButton from "./SetButton.vue";
export default {
  name: "ButtonSection",
  props: {
    data: Object,
    control: Object,
  },
  mounted() {
    this.changeButtonList(this.buttonFactory);
  },
  computed: {
    ...mapGetters(["buttonData", "buttonList", "buttonControl"]),
  },
  components: {
    ClrButton,
    OkButton,
    SetButton,
  },
  methods: {
    ...mapMutations({
      changeCurrentNum: "CHANGE_CURRENT_NUM",
      changeButtonList: "CHANGE_BUTTON_LIST",
      init: "INIT",
    }),
  },
};
</script>

<style>
.color-button-clr {
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
.color-button-green {
  background-color: greenyellow;
  box-shadow: 0rem 0.4rem greenyellow;
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
#other-button-section {
  flex: 1;
  height: 13.8rem;
  display: flex;
  flex-direction: column-reverse;
}
#function-button-section {
  flex: 2;
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  margin: 0rem;
  padding-top: 0rem;
}

.function-button {
  outline:none;
  border: none;
  color: white;
  border-radius: 6%;
  margin: 0.3rem 0.1rem;
  width: 4.8rem;
  height: 4rem;
}
</style>