// apps/web/src/features/patient-profile/api/patient-profile.api.ts

import { apiRequest } from '@/shared/lib/api-client';
import type { PatientProfile, UpdatePatientProfileInput } from '../types';

export function fetchMyPatientProfile() {
  return apiRequest<PatientProfile>('/patient-profile/me');
}

export function updateMyPatientProfile(profileChanges: UpdatePatientProfileInput) {
  return apiRequest<PatientProfile>('/patient-profile/me', {
    method: 'PATCH',
    body: profileChanges,
  });
}
