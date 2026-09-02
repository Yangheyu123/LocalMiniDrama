import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 全能创作工作台 · 独立演示版
// 组件代码与主项目 frontweb 保持一致,数据层替换为本地 mock(见 src/utils/request.js)
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3020,
  },
})
