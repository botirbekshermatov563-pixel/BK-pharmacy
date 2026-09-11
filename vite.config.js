import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Project GitHub Pages site (botirbekshermatov563-pixel.github.io/BK-pharmacy/),
  // not a <user>.github.io root repo — asset URLs need this prefix or they
  // 404 once deployed.
  base: '/BK-pharmacy/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
