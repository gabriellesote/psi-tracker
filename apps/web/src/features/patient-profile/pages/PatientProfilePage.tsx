// apps/web/src/features/patient-profile/pages/PatientProfilePage.tsx
//
// Primeira frente funcionando de ponta a ponta (React → API → Supabase).
// Se você editar o perfil no app do celular, esta tela se atualiza sozinha (tempo real).

import type { PatientProfile } from '@psi-tracker/shared';
import type { FormEvent } from 'react';

import { usePatientProfile, useUpdatePatientProfile } from '../hooks/use-patient-profile';

function readOptionalText(formData: FormData, fieldName: string): string | null {
  const fieldValue = String(formData.get(fieldName) ?? '').trim();
  return fieldValue === '' ? null : fieldValue;
}

export function PatientProfilePage() {
  const { data: patientProfile, isLoading, error } = usePatientProfile();

  if (isLoading) return <p className="text-text-secondary">Carregando perfil…</p>;
  if (error) return <p className="text-danger">Erro ao carregar perfil: {error.message}</p>;
  if (!patientProfile) return null;

  // A key reinicia o formulário quando o perfil muda (inclusive vindo do celular)
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

  const inputClassName =
    'w-full rounded-medium border border-border bg-surface-muted px-4 py-2.5 outline-primary';
  const labelTextClassName = 'text-sm font-semibold text-text-secondary';

  return (
    <section className="max-w-2xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-4xl font-extrabold">Meu perfil</h1>
        {patientProfile.ageInYears !== null && (
          <p className="text-lg text-text-secondary">{patientProfile.ageInYears} anos</p>
        )}
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-large bg-surface p-6 shadow-lg shadow-primary/5 ring-1 ring-border md:p-8"
      >
        <label className="block space-y-1.5">
          <span className={labelTextClassName}>Nome</span>
          <input
            name="fullName"
            defaultValue={patientProfile.fullName ?? ''}
            className={inputClassName}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-3">
          <label className="block space-y-1.5">
            <span className={labelTextClassName}>Data de nascimento</span>
            <input
              name="birthDate"
              type="date"
              defaultValue={patientProfile.birthDate ?? ''}
              className={inputClassName}
            />
          </label>

          <label className="block space-y-1.5">
            <span className={labelTextClassName}>Peso (kg)</span>
            <input
              name="weightKg"
              inputMode="decimal"
              defaultValue={patientProfile.weightKg ?? ''}
              className={inputClassName}
            />
          </label>

          <label className="block space-y-1.5">
            <span className={labelTextClassName}>Gênero</span>
            <input
              name="gender"
              defaultValue={patientProfile.gender ?? ''}
              className={inputClassName}
            />
          </label>
        </div>

        {updatePatientProfile.error && (
          <p className="text-sm text-danger">{updatePatientProfile.error.message}</p>
        )}

        <button
          type="submit"
          disabled={updatePatientProfile.isPending}
          className="rounded-full bg-primary px-6 py-2.5 font-bold text-text-on-primary transition hover:bg-primary-strong disabled:opacity-60"
        >
          {updatePatientProfile.isPending ? 'Salvando…' : 'Salvar'}
        </button>
      </form>

      <p className="text-sm text-text-secondary">
        Remédios e transtornos (investigados e comprovados) entram aqui nas próximas etapas.
      </p>
    </section>
  );
}
