import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import dts from 'vite-plugin-dts';
import { createHtmlPlugin } from 'vite-plugin-html';

const mainBody = fs
  .readFileSync(path.join(import.meta.dirname, 'templates', 'main-body.html'))
  .toString();

const credits = fs
  .readFileSync(path.join(import.meta.dirname, 'templates', 'credits.html'))
  .toString();

const privacyPolicy = fs
  .readFileSync(
    path.join(import.meta.dirname, 'templates', 'privacy-policy.html'),
  )
  .toString();

export default defineConfig({
  build: {
    lib: {
      entry: ['src/index.ts', 'src/templates.ts'],
      name: 'couples-run',
    },
    copyPublicDir: true,
  },
  plugins: [
    dts({ rollupTypes: true }),
    createHtmlPlugin({
      inject: {
        data: {
          mainBody,
          credits,
          privacyPolicy,
        },
      },
    }),
  ],
});
