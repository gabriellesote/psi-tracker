// packages/shared/src/api/create-psi-tracker-api-client.ts
//
// Cliente único da nossa API, usado tanto pelo site quanto pelo app.
// Cada plataforma só informa a URL da API e como obter o token do usuário logado.

import type { UpdatePatientProfileInput } from '../patient-profile/patient-profile.schemas';
import type { PatientProfile } from '../patient-profile/patient-profile.types';

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

export interface PsiTrackerApiClientConfig {
  /** Ex.: http://localhost:3333/api */
  baseUrl: string;
  /** Devolve o token de acesso do usuário logado (ou null se ninguém estiver logado). */
  getAccessToken: () => Promise<string | null>;
}

export function createPsiTrackerApiClient({ baseUrl, getAccessToken }: PsiTrackerApiClientConfig) {
  async function request<ResponseBody>(
    path: string,
    { method = 'GET', body }: ApiRequestOptions = {},
  ): Promise<ResponseBody> {
    const accessToken = await getAccessToken();

    const response = await fetch(`${baseUrl}${path}`, {
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

  return {
    patientProfile: {
      getMine: () => request<PatientProfile>('/patient-profile/me'),
      updateMine: (profileChanges: UpdatePatientProfileInput) =>
        request<PatientProfile>('/patient-profile/me', { method: 'PATCH', body: profileChanges }),
    },
  };
}

export type PsiTrackerApiClient = ReturnType<typeof createPsiTrackerApiClient>;
