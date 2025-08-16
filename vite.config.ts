import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: ['motion/react'],
  },
  resolve: {
    alias: {
      '~': new URL('./src', import.meta.url).pathname,
      '@': new URL('./src', import.meta.url).pathname,
      'motion/react': 'motion/react-client',
    },
    conditions: ['development', 'browser'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    mainFields: ['browser', 'module', 'main'],
    dedupe: ['react', 'react-dom'],
  },
  plugins: [
    tanstackStart({
      customViteReactPlugin: true,
    }),
    react(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
  ],
})
