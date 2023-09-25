import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

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
      '/api': {
        target: 'http://192.168.15.47:8000',
        changeOrigin: true,
        // secure: false,
        // ws: true
      },
      '/test': {
        target: 'http://192.168.15.50:7001',
        changeOrigin: true,
      },
    }
  }
})
