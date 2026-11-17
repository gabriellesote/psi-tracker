// packages/shared/src/index.ts
//
// Porta de entrada do pacote compartilhado: tudo que a API, o site e o app
// importam de "@psi-tracker/shared" passa por aqui.

export * from './api/create-psi-tracker-api-client';
export * from './data-sync/query-keys';
export * from './data-sync/subscribe-to-user-data-changes';
export * from './data-sync/synced-tables';
export * from './design/design-tokens';
export * from './money/format-cents-as-brl';
export * from './patient-profile/patient-profile.schemas';
export * from './patient-profile/patient-profile.types';
