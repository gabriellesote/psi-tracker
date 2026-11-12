// apps/web/src/shared/lib/query-client.ts
//
// O React Query guarda em cache as respostas da API e recarrega quando preciso.
// É ele que mantém as frentes "conectadas" na tela: ao salvar algo em uma,
// invalidamos o cache e as outras se atualizam sozinhas.

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
