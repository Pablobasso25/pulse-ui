import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'pulse-ui': fileURLToPath(
        new URL('../src/index.ts', import.meta.url),
      ),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
