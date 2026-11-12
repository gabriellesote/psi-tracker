// apps/api/src/config/environment.ts
//
// Lê e valida as variáveis de ambiente uma única vez, na inicialização.
// Se algo estiver faltando, a API nem sobe — e mostra exatamente o que falta.

import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(3333),
  WEB_APP_URL: z.url().default('http://localhost:5173'),
  SUPABASE_URL: z.url(),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  console.error('❌ Variáveis de ambiente inválidas:', z.treeifyError(parsedEnvironment.error));
  process.exit(1);
}

export const environment = parsedEnvironment.data;
