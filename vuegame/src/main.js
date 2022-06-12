import {createApp }from 'vue'
import store from "./store/store"
import App from './App.vue'
import levelData from './assets/levelData.json'
const app=createApp(App);
app.use(store);
let minLevel=0,maxLevel=0;
for(let i in levelData.level){
    minLevel=minLevel<levelData.level[i].level?minLevel:levelData.level[i].level;
    if(levelData.level[i].level>0){
        maxLevel++;
    }
}
console.log("欢迎玩这个游戏。");
store.state.data.minLevel=minLevel;
store.state.data.level=minLevel;
store.state.data.maxLevel=maxLevel;
store.commit("GET_LEVEL_DATA",levelData.level[store.state.data.level]);
store.commit("INIT");
app.mount("#app");
