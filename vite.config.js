import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import htmlInject from 'vite-plugin-html-inject';

export default defineConfig({
  base: './',
  plugins: [htmlInject()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        favorites: resolve(import.meta.dirname, 'favorites.html'),
        uiKit: resolve(import.meta.dirname, 'ui-kit.html'),
      },
    },
  },
});
