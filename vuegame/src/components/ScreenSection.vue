<template>
  <div id="frame-section">
    <section id="head">
      <span
        style="
          font-size: 0.9rem;
          color: azure;
          font-style: italic;
          line-height: 1rem;
          width: 4rem;
        "
        >等级: {{ screenData.level }}</span
      >
      <a
        id="play-link"
        href="https://play.google.com/store/apps/details?id=com.sm.calculateme"
        >Calculator:The Game</a
      >
    </section>
    <div
      id="display-section"
      v-show="screenControl.initialMode && !screenControl.setMode"
    >
      <section id="info-display-section">
        <section class="info-display">
          <section class="info-text-display">目标:</section>
          <section class="info-num-display">{{ screenData.goal }}</section>
        </section>
        <section class="info-display">
          <section class="info-text-display">步数:</section>
          <section class="info-num-diaplay">{{ screenData.step }}</section>
        </section>
        <section style="line-height: 3rem">O(∩_∩)O</section>
      </section>
      <section id="number-display-section">
        <led-style-canvas
          v-show="screenControl.ledCanvasDisplay"
          :ledOptions="screenData.ledOptions"
          :key="screenData.ledCanvasKey"
        ></led-style-canvas>
        <div
          v-show="
            screenControl.initialMode &&
            !screenControl.ledCanvasDisplay &&
            screenControl.error
          "
          id="error"
        >
          {{ screenData.errorInfo }}
        </div>
        <div
          v-show="
            screenControl.initialMode &&
            !screenControl.ledCanvasDisplay &&
            screenControl.accomplish
          "
          id="accomplish"
        >
          {{ screenData.accomplishInfo }}
        </div>
      </section>
    </div>
    <div
      id="display-section-pause"
      v-show="screenControl.setMode && !screenControl.initialMode"
    >
      {{ screenData.pauseInfo }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import LedStyleCanvas from "./LedStyleCanvas.vue";
export default {
  name: "ScreenSection",
  computed: {
    ...mapGetters(["screenData", "screenControl"]),
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
  padding-left: 1rem;
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
#display-section-pause {
  font-size: 4rem;
  background-color: #a8b7a2;
  border-radius: 5%;
  text-align: center;
  line-height: 11rem;
  height: 8.97rem;
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
  margin-top: 1rem;
  margin-bottom: 1.55rem;
  padding: 0;
}
#error {
  font-size: 2.6rem;
  margin-top: 1rem;
  margin-bottom: 1.55rem;
  padding: 0;
}
</style>