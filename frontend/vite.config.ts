import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      // Proxy 1: API Java (Backend) - Já existente
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // Proxy 2: API de Agentes (Python) - NOVO
      '/agent-api': {
        target: 'http://localhost:8001', // Aponta para o servidor Python
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/agent-api/, ''), // Remove o prefixo
      },
    },
  },
})

