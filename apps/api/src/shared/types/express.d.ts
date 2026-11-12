// apps/api/src/shared/types/express.d.ts
//
// Ensina o TypeScript que, depois do middleware `authenticate`,
// toda requisição carrega o usuário logado e um cliente Supabase dele.

import type { SupabaseClient } from '@supabase/supabase-js';

export interface AuthenticatedUser {
  id: string;
  email: string | undefined;
}

declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: AuthenticatedUser;
      userSupabaseClient?: SupabaseClient;
    }
  }
}
