import { createApp } from 'vue'
import store from "@/store/index"
import App from '@/App.vue'
import levelData from '@/assets/levelData.json'
const app = createApp(App);
app.use(store);
console.log("欢迎玩这个游戏。");
store.commit("OVERALL_INIT", levelData);
app.mount("#app");