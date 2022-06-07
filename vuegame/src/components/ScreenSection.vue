<template>
  <div id="frame-section">
    <a
      id="play-link"
      href="https://play.google.com/store/apps/details?id=com.sm.calculateme"
      >Calculator:The Game</a
    >
    <div id="display-section">
      <section id="info-display-section">
        <section class="top-display">
          目标:
          {{ goalNumber }}
        </section>
        <section class="top-display">步数:{{ step }}</section>
        <section style="line-height: 2rem">O(∩_∩)O</section>
      </section>
      <section id="number-display-section">
        <led-style-canvas
          v-if="ledNumberDisplay"
          :ledOptions="ledOptions"
          :key="ledCanvasKey"
          style="text-align: right"
        ></led-style-canvas>
        <section v-if="error && !ledNumberDisplay">ERROE</section>
      </section>
    </div>
  </div>
</template>

<script>
import LedStyleCanvas from "./LedStyleCanvas.vue";
export default {
  name: "ScreenSection",
  props: {
    goalNumber: Number,
    step: Number,
    ledNumberDisplay: Boolean,
    error: Boolean,
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
    return {
      ledCanvasKey: 0,
    };
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
/* 链接样式 */
#play-link {
  margin: 0%;
  margin-bottom: 0.5rem;
  padding: 0%;
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
  padding: 0 1rem 0;
}
.top-display {
  font-size: 0.6rem;
  background-color: #3d3c3a;
  text-align: center;
  line-height: 3em;
  word-break: keep-all;
  color: #a9b4aa;
  margin-right: 0.5em;
  margin-top: 0.5em;
  padding: 0;
  height: 30em;
  width: 10em;
  border-radius: 5%;
}
/* 数字显示部分 */
#number-display-section {
  font-size: 2rem;
  text-align: right;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-right: 1rem;
}
</style>