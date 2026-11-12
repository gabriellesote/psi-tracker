// apps/api/src/modules/patient-profile/patient-profile.types.ts

/** Linha exatamente como está na tabela `patient_profiles` (snake_case). */
export interface PatientProfileRow {
  user_id: string;
  full_name: string | null;
  birth_date: string | null;
  weight_kg: number | null;
  gender: string | null;
  updated_at: string;
}

/** Formato que a API devolve para o frontend (camelCase + campos calculados). */
export interface PatientProfile {
  userId: string;
  fullName: string | null;
  birthDate: string | null;
  ageInYears: number | null;
  weightKg: number | null;
  gender: string | null;
  updatedAt: string;
}
