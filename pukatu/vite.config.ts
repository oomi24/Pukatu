import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'public', // Output directory for Vercel
  },
  server: {
    port: 3000, // Optional: specify dev server port
    open: true    // Optional: open browser on server start
  }
});