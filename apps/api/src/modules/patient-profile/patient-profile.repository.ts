// apps/api/src/modules/patient-profile/patient-profile.repository.ts
//
// Camada de acesso a dados: o ÚNICO lugar deste módulo que conversa com o banco.
// Se um dia trocarmos o Supabase por outra coisa, só esta camada muda.

import type { UpdatePatientProfileInput } from '@psi-tracker/shared';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { PatientProfileRow } from './patient-profile.types.js';

const PATIENT_PROFILE_COLUMNS = 'user_id, full_name, birth_date, weight_kg, gender, updated_at';

export class PatientProfileRepository {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async findByUserId(userId: string): Promise<PatientProfileRow | null> {
    const { data, error } = await this.supabaseClient
      .from('patient_profiles')
      .select(PATIENT_PROFILE_COLUMNS)
      .eq('user_id', userId)
      .maybeSingle<PatientProfileRow>();

    if (error) throw error;
    return data;
  }

  async updateByUserId(
    userId: string,
    changes: UpdatePatientProfileInput,
  ): Promise<PatientProfileRow | null> {
    const { data, error } = await this.supabaseClient
      .from('patient_profiles')
      .update({
        full_name: changes.fullName,
        birth_date: changes.birthDate,
        weight_kg: changes.weightKg,
        gender: changes.gender,
      })
      .eq('user_id', userId)
      .select(PATIENT_PROFILE_COLUMNS)
      .maybeSingle<PatientProfileRow>();

    if (error) throw error;
    return data;
  }
}
