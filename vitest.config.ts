import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'jsdom',
    environmentOptions: { jsdom: { url: 'http://localhost/' } },
    include: ['tests/**/*.test.js'],
    setupFiles: ['./tests/setup.js'],
    coverage: {
      provider: 'v8',
      include: [
        'src/modules/**/*.ts',
        'src/stores/**/*.ts',
        'src/components/Button.vue',
        'src/components/screenSection/LedStyleCanvas.vue',
      ],
      exclude: ['src/modules/interface.ts'],
      reporter: ['text', 'html'],
    },
  },
}))
