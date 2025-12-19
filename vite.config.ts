import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // Use sub-path only for GitHub Pages production build
  base: mode === 'production' && process.env.GITHUB_ACTIONS ? '/playwright-trace-manager/' : '/',
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 5173,
    host: true,
    headers: {
      'Service-Worker-Allowed': '/',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    }
  }
}))
