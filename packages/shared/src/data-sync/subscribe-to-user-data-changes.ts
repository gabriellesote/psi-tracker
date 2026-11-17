// packages/shared/src/data-sync/subscribe-to-user-data-changes.ts
//
// Fica "escutando" o banco pelo Supabase Realtime. Quando qualquer tabela do
// usuário muda (no celular ou no computador), avisa quem chamou para recarregar a tela.
// O Row Level Security garante que só chegam alterações dos dados do próprio usuário.

import type { SupabaseClient } from '@supabase/supabase-js';

import { SYNCED_TABLE_NAMES, type SyncedTableName } from './synced-tables';

interface SubscribeToUserDataChangesParams {
  supabaseClient: SupabaseClient;
  userId: string;
  onTableChanged: (tableName: SyncedTableName) => void;
}

/** Começa a escutar as mudanças e devolve uma função para parar de escutar. */
export function subscribeToUserDataChanges({
  supabaseClient,
  userId,
  onTableChanged,
}: SubscribeToUserDataChangesParams): () => void {
  const realtimeChannel = supabaseClient.channel(`user-data-changes:${userId}`);

  for (const tableName of SYNCED_TABLE_NAMES) {
    realtimeChannel.on('postgres_changes', { event: '*', schema: 'public', table: tableName }, () =>
      onTableChanged(tableName),
    );
  }

  realtimeChannel.subscribe();

  return () => {
    void supabaseClient.removeChannel(realtimeChannel);
  };
}
