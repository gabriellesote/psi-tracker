// apps/mobile/src/shared/lib/api-client.ts
//
// Instância do cliente da API para o app (a mesma lógica usada pelo site).

import { createPsiTrackerApiClient } from '@psi-tracker/shared';

import { environment } from '@/shared/config/environment';
import { supabaseClient } from '@/shared/lib/supabase-client';

export const apiClient = createPsiTrackerApiClient({
  baseUrl: environment.apiUrl,
  getAccessToken: async () => {
    const { data } = await supabaseClient.auth.getSession();
    return data.session?.access_token ?? null;
  },
});
