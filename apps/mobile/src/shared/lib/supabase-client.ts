// apps/mobile/src/shared/lib/supabase-client.ts
//
// Cliente Supabase do app.
//   - A sessão fica salva no aparelho (expo-sqlite), então você loga UMA vez só.
//   - O token é renovado automaticamente enquanto o app está aberto.
//   - "pkce" é o fluxo de login seguro recomendado para apps (usado no login com Google).

import 'expo-sqlite/localStorage/install';

import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

import { environment } from '@/shared/config/environment';

export const supabaseClient = createClient(
  environment.supabaseUrl,
  environment.supabasePublishableKey,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
  },
);

// Só renova o token com o app em primeiro plano (economiza bateria)
AppState.addEventListener('change', (appStateStatus) => {
  if (appStateStatus === 'active') {
    supabaseClient.auth.startAutoRefresh();
  } else {
    supabaseClient.auth.stopAutoRefresh();
  }
});
