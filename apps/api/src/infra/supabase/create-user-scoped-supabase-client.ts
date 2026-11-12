// apps/api/src/infra/supabase/create-user-scoped-supabase-client.ts
//
// Cria um cliente Supabase "em nome" do usuário logado.
// Como enviamos o token do próprio usuário, o banco aplica o Row Level Security:
// mesmo que exista um bug na API, uma pessoa nunca consegue ler dados de outra.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { environment } from '../../config/environment.js';

export function createUserScopedSupabaseClient(userAccessToken: string): SupabaseClient {
  return createClient(environment.SUPABASE_URL, environment.SUPABASE_PUBLISHABLE_KEY, {
    global: {
      headers: { Authorization: `Bearer ${userAccessToken}` },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
