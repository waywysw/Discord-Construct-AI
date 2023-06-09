import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mkcert({
      host: 'localhost',
      port: 443,
      open: true,
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        timeout: 0,
      },
      '/v1': {
        target: 'https://127.0.0.1:5100/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/v1/, ''),
        timeout: 0,
      },
    },
  },
});
