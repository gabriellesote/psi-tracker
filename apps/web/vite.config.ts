// apps/web/vite.config.ts

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// No Windows, o Docker não "percebe" quando você salva um arquivo.
// Com polling ligado, o Vite verifica os arquivos periodicamente e o hot reload funciona.
const shouldUsePollingWatcher = process.env.WATCH_WITH_POLLING === 'true';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true, // aceita conexões de fora do container
    port: 5173,
    strictPort: true,
    watch: shouldUsePollingWatcher ? { usePolling: true, interval: 300 } : undefined,
  },
});
