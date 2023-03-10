import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/user': {
        target: 'http://192.168.15.47:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/user/, ''),
        // secure: false,
        // ws: true
      }
    }
  }
})
