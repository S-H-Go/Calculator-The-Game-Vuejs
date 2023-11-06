import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: "/Calculator-The-Game-Vuejs/",
    server: {
        host: true,
        port: 80,
    }
})
