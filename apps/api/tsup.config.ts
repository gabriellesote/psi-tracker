// apps/api/tsup.config.ts
//
// Gera o build de produção da API em um único arquivo JavaScript (dist/server.js).

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node22',
  outDir: 'dist',
  sourcemap: true,
  clean: true,
  // O pacote compartilhado é TypeScript puro, então precisa entrar no build
  noExternal: ['@psi-tracker/shared'],
});
