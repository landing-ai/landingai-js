/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globals: true,
    environment: 'jsdom',
    testTimeout: 20000,
    setupFiles: './vitest.setup.tsx',
    watch: false,
    threads: false, // disable worker threads so that canvas runs in main thread
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
