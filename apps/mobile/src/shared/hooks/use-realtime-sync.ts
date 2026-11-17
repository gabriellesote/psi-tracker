// apps/mobile/src/shared/hooks/use-realtime-sync.ts
//
// Liga a sincronização em tempo real: mudou algo no site (ou em outro aparelho),
// o app recarrega na hora as telas afetadas.

import { queryKeysAffectedByTable, subscribeToUserDataChanges } from '@psi-tracker/shared';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { supabaseClient } from '@/shared/lib/supabase-client';

export function useRealtimeSync(currentUserId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!currentUserId) return;

    return subscribeToUserDataChanges({
      supabaseClient,
      userId: currentUserId,
      onTableChanged: (tableName) => {
        for (const affectedQueryKey of queryKeysAffectedByTable[tableName]) {
          void queryClient.invalidateQueries({ queryKey: affectedQueryKey });
        }
      },
    });
  }, [currentUserId, queryClient]);
}
