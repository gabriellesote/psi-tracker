// apps/api/src/shared/http/middlewares/error-handler.ts
//
// Ponto único de tratamento de erros. Toda exceção lançada em uma rota
// termina aqui e vira uma resposta JSON padronizada.

import type { NextFunction, Request, Response } from 'express';
import { ZodError, z } from 'zod';

import { AppError } from '../../errors/app-error.js';

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  // O Express identifica um error handler por ter 4 parâmetros
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    return response.status(422).json({
      message: 'Dados inválidos',
      issues: z.flattenError(error).fieldErrors,
    });
  }

  if (error instanceof AppError) {
    return response.status(error.httpStatusCode).json({ message: error.message });
  }

  console.error('Erro inesperado:', error);
  return response.status(500).json({ message: 'Erro interno do servidor' });
}
