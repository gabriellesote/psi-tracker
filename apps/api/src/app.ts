// apps/api/src/app.ts
//
// Monta o app Express (middlewares + rotas), sem iniciar o servidor.
// Separar isso do server.ts facilita escrever testes depois.

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { environment } from './config/environment.js';
import { apiRoutes } from './routes.js';
import { errorHandler } from './shared/http/middlewares/error-handler.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: environment.WEB_APP_URL }));
  app.use(express.json());

  app.use('/api', apiRoutes);

  app.use((_request, response) => {
    response.status(404).json({ message: 'Rota não encontrada' });
  });
  app.use(errorHandler);

  return app;
}
