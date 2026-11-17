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
