import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ command }) => {
  const isProd = command === 'build'
  return {
    plugins: [vue()],
    base: process.env.VITE_BASE_PATH || '/',
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      port: 4000,
      open: true,
      hot: true
    },
    build: {
      minify: isProd ? 'esbuild' : 'terser',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('markdown-it')) return 'markdown'
            if (id.includes('katex')) return 'katex'
          }
        }
      }
    },
    css: {
      devSourcemap: true
    }
  }
})
