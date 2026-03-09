import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize build output
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['bootstrap', 'bootstrap-icons', 'recharts'],
          'toast': ['react-toastify'],
        },
      },
    },
    // Better reporting
    reportCompressedSize: false,
  },
  // Optimizations for dev server
  server: {
    middlewareMode: false,
  },
})
