import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  root: '.',
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@/shared': path.resolve(__dirname, './src'),
    },
  },
})
