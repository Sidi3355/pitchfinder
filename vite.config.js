import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standalone app — lives in its own folder so it can be lifted into a
// dedicated repository later without touching anything outside topbins/.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5173, host: true },
})
