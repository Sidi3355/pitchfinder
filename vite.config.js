/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Absolute base: the app uses real routes (/p/{id}, /g/{slug}) so assets
  // must resolve from the site root, not relative to the current path.
  base: '/',
  server: { port: 5173, host: true },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/maplibre-gl')) return 'maplibre'
          if (id.includes('node_modules/@supabase')) return 'supabase'
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: [
      'src/**/*.test.{js,jsx,ts,tsx}',
      'scripts/**/*.test.mjs',
      'tests/unit/**/*.test.{js,mjs,ts}',
    ],
    exclude: ['node_modules', 'dist', 'tests/e2e'],
  },
})
