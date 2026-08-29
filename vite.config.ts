import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: 'site',
  publicDir: 'public',
  build: {
    outDir: process.env.SITE_OUT_DIR ? resolve(process.env.SITE_OUT_DIR) : resolve('dist/site'),
    emptyOutDir: true,
    target: 'es2022',
    rollupOptions: {
      input: {
        index: resolve('site/index.html'),
        demo: resolve('site/demo.html'),
        privacy: resolve('site/privacy.html'),
        terms: resolve('site/terms.html'),
        '404': resolve('site/404.html'),
      },
    },
  },
});
