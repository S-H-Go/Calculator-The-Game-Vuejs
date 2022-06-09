<template>
  <div id="frame-section">
    <section id="head">
      <span style="color: azure; font-style: italic; line-height: 1rem"
        >等级: {{ info.level }}</span
      >
      <a
        id="play-link"
        href="https://play.google.com/store/apps/details?id=com.sm.calculateme"
        >Calculator:The Game</a
      >
    </section>
    <div id="display-section">
      <section id="info-display-section">
        <section class="info-display">
          <section class="info-text-display">目标:</section>
          <section class="info-num-display">{{ info.goal }}</section>
        </section>
        <section class="info-display">
          <section class="info-text-display">步数:</section>
          <section class="info-num-diaplay">{{ info.step }}</section>
        </section>
        <section style="line-height: 3rem">O(∩_∩)O</section>
      </section>
      <section id="number-display-section">
        <led-style-canvas
          v-show="control.ledCanvasDisplay"
          :ledOptions="ledOptions"
          :key="info.ledCanvasKey"
        ></led-style-canvas>
        <div v-show="!control.ledCanvasDisplay && control.error" id="error">
          {{ info.errorInfo }}
        </div>
        <div
          v-show="!control.ledCanvasDisplay && control.accomplish"
          id="accomplish"
        >
          {{ info.accomplishInfo }}
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import LedStyleCanvas from "./LedStyleCanvas.vue";
export default {
  name: "ScreenSection",
  props: {
    info: {
      level: Number,
      step: Number,
      goal: Number,
      ledCanvasKey: Number,
      errorInfo: String,
      accomplishInfo: String,
    },
    control: {
      ledCanvasDisplay: Boolean,
      error: Boolean,
      accomplish: Boolean,
    },
    ledOptions: {
      color: String,
      width: Number,
      height: Number,
      values: Number,
      lineWidth: Number,
      italics: Number,
      opacity: Number,
    },
  },
  data() {
    return {};
  },
  components: { LedStyleCanvas },
};
</script>
<style>
/* 边框部分 */
#frame-section {
  background-color: #3d3c3a;
  padding: 0.5rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  border-radius: 5%;
  margin: 0;
}
#head {
  display: flex;
  flex-direction: row;
}
/* 链接样式 */
#play-link {
  font-size: 0.5rem;
  margin: 0%;
  margin-bottom: 0.5rem;
  padding-left: 2rem;
  color: white;
  text-decoration: none;
}
#play-link:hover {
  color: #ea6c18;
}
/* 显示部分 */
#display-section {
  background-color: #a8b7a2;
  border-radius: 5%;
}
/* 信息显示部分 */
#info-display-section {
  display: flex;
  flex-direction: row-reverse;
  align-items: stretch;
  padding: 0;
}
.info-display {
  font-size: 0.8rem;
  width: 6em;
  background-color: #3d3c3a;
  text-align: center;
  line-height: 2em;
  word-break: keep-all;
  color: #a9b4aa;
  margin-right: 0.5em;
  margin-top: 0.5em;
  border-radius: 5%;
}
.info-text-display {
  height: 1.2em;
}
.info-num-display {
  height: 1em;
}
/* 数字显示部分 */
#number-display-section {
  font-size: 4rem;
  text-align: right;
  margin-top: 0.1rem;
  margin-bottom: 0.6rem;
  padding-right: 0.5rem;
}
#accomplish {
  font-size: 2.6rem;
  margin-top: 0.6rem;
  margin-bottom: 1.27rem;
  padding: 0;
}
#error {
  font-size: 2.6rem;
  margin-top: 1rem;
  margin-bottom: 1.33rem;
  padding: 0;
}
</style>