// apps/web/src/shared/config/environment.ts
//
// Centraliza as variáveis de ambiente do frontend e avisa cedo se faltar alguma.

function readRequiredVariable(variableName: keyof ImportMetaEnv): string {
  const variableValue = import.meta.env[variableName];

  if (!variableValue) {
    throw new Error(`Variável de ambiente ausente: ${variableName}. Confira seu arquivo .env`);
  }

  return variableValue;
}

export const environment = {
  supabaseUrl: readRequiredVariable('VITE_SUPABASE_URL'),
  supabasePublishableKey: readRequiredVariable('VITE_SUPABASE_PUBLISHABLE_KEY'),
  apiUrl: readRequiredVariable('VITE_API_URL'),
} as const;
