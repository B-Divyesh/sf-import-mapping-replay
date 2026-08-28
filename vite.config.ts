import { defineConfig } from 'vite';
import { cpSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  root: 'site',
  publicDir: 'public',
  build: {
    outDir: '../dist/site',
    emptyOutDir: true,
    target: 'es2022',
  },
  plugins: [{
    name: 'copy-404',
    closeBundle() {
      cpSync(resolve('dist/site/index.html'), resolve('dist/site/404.html'));
    },
  }],
});
