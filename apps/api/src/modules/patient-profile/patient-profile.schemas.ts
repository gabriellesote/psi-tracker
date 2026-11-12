// apps/api/src/modules/patient-profile/patient-profile.schemas.ts
//
// Regras de validação do que o frontend pode enviar.

import { z } from 'zod';

export const updatePatientProfileSchema = z.object({
  fullName: z.string().trim().min(1).max(120).nullable().optional(),
  birthDate: z.iso.date().nullable().optional(), // formato AAAA-MM-DD
  weightKg: z.number().positive().max(500).nullable().optional(),
  gender: z.string().trim().max(60).nullable().optional(),
});

export type UpdatePatientProfileInput = z.infer<typeof updatePatientProfileSchema>;
