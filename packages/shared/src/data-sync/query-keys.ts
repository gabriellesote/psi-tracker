// packages/shared/src/data-sync/query-keys.ts
//
// "Endereços" do cache do React Query. Site e app usam as mesmas chaves,
// então a sincronização em tempo real sabe exatamente o que recarregar.

export const queryKeys = {
  patientProfile: ['patient-profile'] as const,
  medications: ['medications'] as const,
  diagnoses: ['diagnoses'] as const,
  therapySessions: ['therapy-sessions'] as const,
  finance: ['finance'] as const,
  notebook: ['notebook'] as const,
  dailyJournal: ['daily-journal'] as const,
};

export type QueryKey = (typeof queryKeys)[keyof typeof queryKeys];
