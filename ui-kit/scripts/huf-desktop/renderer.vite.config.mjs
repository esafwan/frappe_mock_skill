// Renderer-only build of Huf Desktop for the ui-kit capture harness (mirrors the `renderer` block of electron.vite.config.ts).
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
const R = path.resolve(import.meta.dirname, 'src/renderer');
export default defineConfig({
  root: R,
  base: './',
  build: {
    outDir: process.env.OUT_DIR,
    emptyOutDir: true,
    rollupOptions: { input: { index: path.join(R, 'index.html'), approval: path.join(R, 'approval/index.html') } },
  },
  resolve: { alias: { '@renderer': R, '@': R } },
  plugins: [react(), tailwindcss()],
});
