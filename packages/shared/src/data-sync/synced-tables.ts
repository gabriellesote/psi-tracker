// packages/shared/src/data-sync/synced-tables.ts
//
// Tabelas acompanhadas em tempo real e quais telas cada uma afeta.
// Ex.: marcar uma sessão como "realizada" muda a lista de sessões E o saldo do financeiro.

import { queryKeys, type QueryKey } from './query-keys';

export const SYNCED_TABLE_NAMES = [
  'patient_profiles',
  'medications',
  'medication_intakes',
  'diagnoses',
  'session_packages',
  'therapy_sessions',
  'notebook_pages',
  'daily_logs',
] as const;

export type SyncedTableName = (typeof SYNCED_TABLE_NAMES)[number];

export const queryKeysAffectedByTable: Record<SyncedTableName, readonly QueryKey[]> = {
  patient_profiles: [queryKeys.patientProfile],
  medications: [queryKeys.medications, queryKeys.dailyJournal],
  medication_intakes: [queryKeys.dailyJournal, queryKeys.medications],
  diagnoses: [queryKeys.diagnoses],
  session_packages: [queryKeys.finance],
  therapy_sessions: [queryKeys.therapySessions, queryKeys.finance, queryKeys.notebook],
  notebook_pages: [queryKeys.notebook],
  daily_logs: [queryKeys.dailyJournal],
};
