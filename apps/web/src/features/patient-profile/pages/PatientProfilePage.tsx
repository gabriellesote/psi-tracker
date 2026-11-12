// apps/web/src/features/patient-profile/pages/PatientProfilePage.tsx
//
// Primeira frente funcionando de ponta a ponta (React → API → Supabase).
// Serve de modelo para construir as próximas.

import type { FormEvent } from 'react';

import type { PatientProfile } from '../types';
import { usePatientProfile, useUpdatePatientProfile } from '../hooks/use-patient-profile';

function readOptionalText(formData: FormData, fieldName: string): string | null {
  const fieldValue = String(formData.get(fieldName) ?? '').trim();
  return fieldValue === '' ? null : fieldValue;
}

export function PatientProfilePage() {
  const { data: patientProfile, isLoading, error } = usePatientProfile();

  if (isLoading) return <p className="text-slate-500">Carregando perfil…</p>;
  if (error) return <p className="text-red-600">Erro ao carregar perfil: {error.message}</p>;
  if (!patientProfile) return null;

  // A key força o formulário a reiniciar quando o perfil salvo muda
  return <PatientProfileForm key={patientProfile.updatedAt} patientProfile={patientProfile} />;
}

function PatientProfileForm({ patientProfile }: { patientProfile: PatientProfile }) {
  const updatePatientProfile = useUpdatePatientProfile();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const weightText = readOptionalText(formData, 'weightKg');

    updatePatientProfile.mutate({
      fullName: readOptionalText(formData, 'fullName'),
      birthDate: readOptionalText(formData, 'birthDate'),
      weightKg: weightText === null ? null : Number(weightText.replace(',', '.')),
      gender: readOptionalText(formData, 'gender'),
    });
  }

  const inputClassName = 'w-full rounded-lg border border-slate-300 px-3 py-2';

  return (
    <section className="max-w-xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">Meu perfil</h1>
        {patientProfile.ageInYears !== null && (
          <p className="text-slate-600">{patientProfile.ageInYears} anos</p>
        )}
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-slate-200"
      >
        <label className="block space-y-1">
          <span className="text-sm text-slate-600">Nome</span>
          <input
            name="fullName"
            defaultValue={patientProfile.fullName ?? ''}
            className={inputClassName}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block space-y-1">
            <span className="text-sm text-slate-600">Data de nascimento</span>
            <input
              name="birthDate"
              type="date"
              defaultValue={patientProfile.birthDate ?? ''}
              className={inputClassName}
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm text-slate-600">Peso (kg)</span>
            <input
              name="weightKg"
              inputMode="decimal"
              defaultValue={patientProfile.weightKg ?? ''}
              className={inputClassName}
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm text-slate-600">Gênero</span>
            <input
              name="gender"
              defaultValue={patientProfile.gender ?? ''}
              className={inputClassName}
            />
          </label>
        </div>

        {updatePatientProfile.error && (
          <p className="text-sm text-red-600">{updatePatientProfile.error.message}</p>
        )}

        <button
          type="submit"
          disabled={updatePatientProfile.isPending}
          className="rounded-lg bg-violet-600 px-4 py-2 font-medium text-white hover:bg-violet-700 disabled:opacity-60"
        >
          {updatePatientProfile.isPending ? 'Salvando…' : 'Salvar'}
        </button>
      </form>

      <p className="text-sm text-slate-500">
        Remédios e transtornos (investigados e comprovados) entram aqui nas próximas etapas.
      </p>
    </section>
  );
}
