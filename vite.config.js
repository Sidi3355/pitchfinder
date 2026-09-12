/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Absolute base: the app uses real routes (/p/{id}, /g/{slug}) so assets
  // must resolve from the site root, not relative to the current path.
  base: '/',
  // The Supabase to Vercel integration sets NEXT_PUBLIC_SUPABASE_URL and
  // NEXT_PUBLIC_SUPABASE_ANON_KEY; accept those as well as the VITE_ names.
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  server: { port: 5173, host: true },
  build: {
    sourcemap: true,
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
      'tests/rls/**/*.test.mjs',
    ],
    exclude: ['node_modules', 'dist', 'tests/e2e'],
  },
})
