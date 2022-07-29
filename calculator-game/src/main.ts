import { createApp } from 'vue'
import App from '@/App.vue'
import { createPinia } from 'pinia'
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
console.log("欢迎玩这个游戏。")
app.mount("#app")
const test = "asfdsav";

