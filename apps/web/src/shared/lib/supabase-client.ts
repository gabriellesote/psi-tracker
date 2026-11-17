// apps/web/src/shared/lib/supabase-client.ts
//
// Cliente Supabase do navegador, usado para login e para a sincronização em tempo real.
// A sessão fica salva no navegador e o token é renovado sozinho:
// você loga uma vez e continua logada até clicar em "Sair".

import { createClient } from '@supabase/supabase-js';

import { environment } from '@/shared/config/environment';

export const supabaseClient = createClient(
  environment.supabaseUrl,
  environment.supabasePublishableKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // lê a sessão quando o Google devolve para o site
      flowType: 'pkce',
    },
  },
);
