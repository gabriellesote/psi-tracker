// packages/shared/src/patient-profile/patient-profile.types.ts
//
// Formato do perfil que a API devolve e que o site e o app exibem.

export interface PatientProfile {
  userId: string;
  fullName: string | null;
  birthDate: string | null;
  ageInYears: number | null;
  weightKg: number | null;
  gender: string | null;
  updatedAt: string;
}
