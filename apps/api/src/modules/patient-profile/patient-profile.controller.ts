// apps/api/src/modules/patient-profile/patient-profile.controller.ts
//
// Camada HTTP: lê a requisição, valida a entrada, chama o service e responde.
// Nenhuma regra de negócio mora aqui.

import type { Request, Response } from 'express';

import { getAuthenticatedContext } from '../../shared/http/get-authenticated-context.js';
import { PatientProfileRepository } from './patient-profile.repository.js';
import { updatePatientProfileSchema } from './patient-profile.schemas.js';
import { PatientProfileService } from './patient-profile.service.js';

function buildPatientProfileService(request: Request) {
  const { userSupabaseClient } = getAuthenticatedContext(request);
  return new PatientProfileService(new PatientProfileRepository(userSupabaseClient));
}

export async function getMyPatientProfile(request: Request, response: Response) {
  const { authenticatedUser } = getAuthenticatedContext(request);
  const patientProfile = await buildPatientProfileService(request).getProfile(authenticatedUser.id);

  response.json(patientProfile);
}

export async function updateMyPatientProfile(request: Request, response: Response) {
  const { authenticatedUser } = getAuthenticatedContext(request);
  const profileChanges = updatePatientProfileSchema.parse(request.body);

  const updatedProfile = await buildPatientProfileService(request).updateProfile(
    authenticatedUser.id,
    profileChanges,
  );

  response.json(updatedProfile);
}
