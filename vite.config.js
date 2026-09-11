import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Project GitHub Pages site (botirbekshermatov563-pixel.github.io/BK-pharmacy/),
  // not a <user>.github.io root repo — asset URLs need this prefix or they
  // 404 once deployed.
  base: '/BK-pharmacy/',
  plugins: [react()],
  // `motion/react`'s dep-pre-bundling occasionally splits its internal
  // `motion` factory into a separate chunk from its usage under esbuild,
  // throwing "motion is not defined" at runtime. Forcing it into
  // optimizeDeps keeps it as one consistently-bundled chunk.
  optimizeDeps: {
    include: ['motion/react']
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
