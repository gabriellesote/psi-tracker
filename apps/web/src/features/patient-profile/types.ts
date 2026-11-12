// apps/web/src/features/patient-profile/types.ts
// Espelha o formato devolvido pela API em GET /api/patient-profile/me

export interface PatientProfile {
  userId: string;
  fullName: string | null;
  birthDate: string | null;
  ageInYears: number | null;
  weightKg: number | null;
  gender: string | null;
  updatedAt: string;
}

export type UpdatePatientProfileInput = Partial<
  Pick<PatientProfile, 'fullName' | 'birthDate' | 'weightKg' | 'gender'>
>;
