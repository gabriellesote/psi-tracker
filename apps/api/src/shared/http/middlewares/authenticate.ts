// apps/api/src/shared/http/middlewares/authenticate.ts
//
// Protege as rotas: exige o header "Authorization: Bearer <token do Supabase>".
// O token é validado no próprio Supabase Auth.

import type { NextFunction, Request, Response } from 'express';

import { createUserScopedSupabaseClient } from '../../../infra/supabase/create-user-scoped-supabase-client.js';
import { UnauthorizedError } from '../../errors/app-error.js';

const BEARER_PREFIX = 'Bearer ';

export async function authenticate(request: Request, _response: Response, next: NextFunction) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith(BEARER_PREFIX)) {
    throw new UnauthorizedError('Token de acesso ausente');
  }

  const accessToken = authorizationHeader.slice(BEARER_PREFIX.length);
  const userSupabaseClient = createUserScopedSupabaseClient(accessToken);
  const { data, error } = await userSupabaseClient.auth.getUser(accessToken);

  if (error || !data.user) {
    throw new UnauthorizedError('Token de acesso inválido ou expirado');
  }

  request.authenticatedUser = { id: data.user.id, email: data.user.email };
  request.userSupabaseClient = userSupabaseClient;
  next();
}
