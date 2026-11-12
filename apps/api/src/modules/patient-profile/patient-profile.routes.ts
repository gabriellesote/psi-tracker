// apps/api/src/modules/patient-profile/patient-profile.routes.ts

import { Router } from 'express';

import { authenticate } from '../../shared/http/middlewares/authenticate.js';
import { getMyPatientProfile, updateMyPatientProfile } from './patient-profile.controller.js';

export const patientProfileRoutes = Router();

patientProfileRoutes.use(authenticate);
patientProfileRoutes.get('/me', getMyPatientProfile);
patientProfileRoutes.patch('/me', updateMyPatientProfile);
