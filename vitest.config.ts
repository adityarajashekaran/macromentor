// Example vitest.config.ts (customize as needed)
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts', // Create this file for jest-dom setup
    css: true, // If you need CSS processing
  },
}) 