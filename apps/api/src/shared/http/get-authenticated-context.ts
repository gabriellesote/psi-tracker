// apps/api/src/shared/http/get-authenticated-context.ts
//
// Atalho tipado para os controllers pegarem o usuário e o cliente Supabase
// já garantidos pelo middleware `authenticate`.

import type { Request } from 'express';

import { UnauthorizedError } from '../errors/app-error.js';

export function getAuthenticatedContext(request: Request) {
  const { authenticatedUser, userSupabaseClient } = request;

  if (!authenticatedUser || !userSupabaseClient) {
    throw new UnauthorizedError();
  }

  return { authenticatedUser, userSupabaseClient };
}
