// apps/mobile/src/shared/lib/query-client.ts
//
// Cache das respostas da API. A sincronização em tempo real invalida este cache
// sempre que algo muda no banco, e a tela se atualiza sozinha.

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});
