// apps/api/src/server.ts
//
// Ponto de entrada: sobe o servidor HTTP.

import { createApp } from './app.js';
import { environment } from './config/environment.js';

const app = createApp();

app.listen(environment.API_PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${environment.API_PORT}/api`);
});
