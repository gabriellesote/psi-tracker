// apps/mobile/src/shared/config/environment.ts
//
// Variáveis de ambiente do app (arquivo apps/mobile/.env).
// O Expo só embute variáveis que começam com EXPO_PUBLIC_ e que são lidas
// escrevendo o nome completo (process.env.EXPO_PUBLIC_...), por isso não usamos um loop.

function ensureVariableIsDefined(variableName: string, variableValue: string | undefined): string {
  if (!variableValue) {
    throw new Error(`Variável de ambiente ausente: ${variableName}. Confira apps/mobile/.env`);
  }

  return variableValue;
}

export const environment = {
  supabaseUrl: ensureVariableIsDefined(
    'EXPO_PUBLIC_SUPABASE_URL',
    process.env.EXPO_PUBLIC_SUPABASE_URL,
  ),
  supabasePublishableKey: ensureVariableIsDefined(
    'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  ),
  apiUrl: ensureVariableIsDefined('EXPO_PUBLIC_API_URL', process.env.EXPO_PUBLIC_API_URL),
} as const;
