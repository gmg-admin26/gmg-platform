import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function gracefulPublicCopy(): import('vite').Plugin {
  return {
    name: 'graceful-public-copy',
    apply: 'build',
    configResolved(config) {
      const origCopyFileSync = fs.copyFileSync.bind(fs);
      (fs as typeof fs).copyFileSync = function (src, dest, ...args) {
        try {
          origCopyFileSync(src, dest, ...args);
        } catch (e: unknown) {
          const err = e as NodeJS.ErrnoException;
          if (err.code === 'EAGAIN' || err.code === 'EBUSY') {
            config.logger.warn(`Skipping inaccessible file: ${src}`);
          } else {
            throw e;
          }
        }
      };
    },
  };
}

export default defineConfig({
  plugins: [react(), gracefulPublicCopy()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  publicDir: 'public',
});
