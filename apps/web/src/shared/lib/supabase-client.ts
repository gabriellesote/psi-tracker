// apps/web/src/shared/lib/supabase-client.ts
//
// Cliente Supabase do navegador. No frontend ele é usado APENAS para login/cadastro;
// os dados em si passam pela nossa API.

import { createClient } from '@supabase/supabase-js';

import { environment } from '@/shared/config/environment';

export const supabaseClient = createClient(
  environment.supabaseUrl,
  environment.supabasePublishableKey,
);
