import { defineConfig } from 'vitest/config'

export default defineConfig({
  root: '.',
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/auth/proxy.test.ts', '**/auth/server.test.ts', '**/ui/**', '**/llm/prompt-catalog.test.ts'],
    setupFiles: [new URL('./.tests/setup.ts', import.meta.url).pathname],
  },
})
