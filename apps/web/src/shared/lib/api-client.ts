// apps/web/src/shared/lib/api-client.ts
//
// Função única para chamar a nossa API. Ela já:
//   - coloca o token do usuário logado no header
//   - converte o corpo para JSON
//   - transforma respostas de erro em exceções legíveis

import { environment } from '@/shared/config/environment';
import { supabaseClient } from '@/shared/lib/supabase-client';

export class ApiRequestError extends Error {
  readonly httpStatusCode: number;

  constructor(message: string, httpStatusCode: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.httpStatusCode = httpStatusCode;
  }
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface ApiRequestOptions {
  method?: HttpMethod;
  body?: unknown;
}

export async function apiRequest<ResponseBody>(
  path: string,
  { method = 'GET', body }: ApiRequestOptions = {},
): Promise<ResponseBody> {
  const { data: sessionData } = await supabaseClient.auth.getSession();
  const accessToken = sessionData.session?.access_token;

  const response = await fetch(`${environment.apiUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = responseBody?.message ?? 'Erro ao comunicar com o servidor';
    throw new ApiRequestError(errorMessage, response.status);
  }

  return responseBody as ResponseBody;
}
