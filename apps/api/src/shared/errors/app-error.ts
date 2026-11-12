// apps/api/src/shared/errors/app-error.ts
//
// Erro "esperado" da aplicação (ex.: recurso não encontrado, não autorizado).
// O error handler transforma isso numa resposta HTTP com o status correto.

export class AppError extends Error {
  public readonly httpStatusCode: number;

  constructor(message: string, httpStatusCode = 400) {
    super(message);
    this.name = 'AppError';
    this.httpStatusCode = httpStatusCode;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Não autenticado') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class NotFoundError extends AppError {
  constructor(resourceName: string) {
    super(`${resourceName} não encontrado(a)`, 404);
    this.name = 'NotFoundError';
  }
}
