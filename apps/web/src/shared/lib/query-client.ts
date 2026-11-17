// apps/web/src/shared/lib/query-client.ts
//
// Cache das respostas da API. A sincronização em tempo real invalida este cache
// sempre que algo muda no banco (inclusive pelo celular) e a tela se atualiza sozinha.
// Ao voltar para a aba do navegador, os dados também são conferidos (rede de segurança).

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});
