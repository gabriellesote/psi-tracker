// apps/api/src/modules/health/health.routes.ts
//
// Rota pública usada para checar se a API está no ar (o Docker também usa).

import { Router } from 'express';

export const healthRoutes = Router();

healthRoutes.get('/', (_request, response) => {
  response.json({ status: 'ok', timestamp: new Date().toISOString() });
});
