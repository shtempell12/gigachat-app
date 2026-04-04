import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          markdown: ['react-markdown', 'remark-gfm', 'rehype-highlight'],
          highlight: ['highlight.js'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api/gigachat': {
        target: 'https://gigachat.devices.sberbank.ru',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/gigachat/, ''),
        secure: false,
      },
      '/api/oauth': {
        target: 'https://ngw.devices.sberbank.ru:9443',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/oauth/, ''),
        secure: false,
      },
    },
  },
})
