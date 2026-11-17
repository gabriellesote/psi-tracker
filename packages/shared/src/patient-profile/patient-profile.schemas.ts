// packages/shared/src/patient-profile/patient-profile.schemas.ts
//
// Regras de validação do perfil. A API usa para barrar dados inválidos
// e o site/app podem usar para validar o formulário antes de enviar.

import { z } from 'zod';

export const updatePatientProfileSchema = z.object({
  fullName: z.string().trim().min(1).max(120).nullable().optional(),
  birthDate: z.iso.date().nullable().optional(), // formato AAAA-MM-DD
  weightKg: z.number().positive().max(500).nullable().optional(),
  gender: z.string().trim().max(60).nullable().optional(),
});

export type UpdatePatientProfileInput = z.infer<typeof updatePatientProfileSchema>;
