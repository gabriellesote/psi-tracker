// apps/api/src/modules/patient-profile/patient-profile.service.ts
//
// Regras de negócio do perfil. Não sabe nada de HTTP nem de SQL:
// recebe dados, aplica regras e devolve no formato da aplicação.

import type { PatientProfile, UpdatePatientProfileInput } from '@psi-tracker/shared';

import { NotFoundError } from '../../shared/errors/app-error.js';
import type { PatientProfileRepository } from './patient-profile.repository.js';
import type { PatientProfileRow } from './patient-profile.types.js';

export function calculateAgeInYears(birthDate: string, referenceDate = new Date()): number {
  const [birthYear, birthMonth, birthDay] = birthDate.split('-').map(Number) as [
    number,
    number,
    number,
  ];

  let ageInYears = referenceDate.getFullYear() - birthYear;
  const hasHadBirthdayThisYear =
    referenceDate.getMonth() + 1 > birthMonth ||
    (referenceDate.getMonth() + 1 === birthMonth && referenceDate.getDate() >= birthDay);

  if (!hasHadBirthdayThisYear) ageInYears -= 1;
  return ageInYears;
}

function toPatientProfile(row: PatientProfileRow): PatientProfile {
  return {
    userId: row.user_id,
    fullName: row.full_name,
    birthDate: row.birth_date,
    ageInYears: row.birth_date ? calculateAgeInYears(row.birth_date) : null,
    weightKg: row.weight_kg === null ? null : Number(row.weight_kg),
    gender: row.gender,
    updatedAt: row.updated_at,
  };
}

export class PatientProfileService {
  constructor(private readonly patientProfileRepository: PatientProfileRepository) {}

  async getProfile(userId: string): Promise<PatientProfile> {
    const profileRow = await this.patientProfileRepository.findByUserId(userId);
    if (!profileRow) throw new NotFoundError('Perfil do paciente');

    return toPatientProfile(profileRow);
  }

  async updateProfile(userId: string, changes: UpdatePatientProfileInput): Promise<PatientProfile> {
    const updatedRow = await this.patientProfileRepository.updateByUserId(userId, changes);
    if (!updatedRow) throw new NotFoundError('Perfil do paciente');

    return toPatientProfile(updatedRow);
  }
}
