// apps/api/src/routes.ts
//
// Índice de todas as rotas da API. Cada módulo novo (sessões, financeiro,
// caderno, diário...) é registrado aqui.

import { Router } from 'express';

import { healthRoutes } from './modules/health/health.routes.js';
import { patientProfileRoutes } from './modules/patient-profile/patient-profile.routes.js';

export const apiRoutes = Router();

apiRoutes.use('/health', healthRoutes);
apiRoutes.use('/patient-profile', patientProfileRoutes);
