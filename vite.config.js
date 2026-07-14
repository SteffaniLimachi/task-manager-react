import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      all: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/test/**',
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/main.tsx',
        'src/types.ts',
        'src/config.ts',
        'src/vite-env.d.ts',
        'src/global.d.ts',
      ],
      thresholds: {
        lines: 10,
        functions: 15,
        branches: 10,
        statements: 10,
      },
    },
  },
})
