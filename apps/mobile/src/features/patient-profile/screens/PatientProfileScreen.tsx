// apps/mobile/src/features/patient-profile/screens/PatientProfileScreen.tsx
//
// Primeira frente funcionando de ponta a ponta no app (App → API → Supabase).
// Se você editar o perfil no site, esta tela se atualiza sozinha (tempo real).

import type { PatientProfile } from '@psi-tracker/shared';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '@/features/auth/context/use-auth';
import { AppText } from '@/shared/components/AppText';
import { Card } from '@/shared/components/Card';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { TextField } from '@/shared/components/TextField';
import { usePatientProfile, useUpdatePatientProfile } from '../hooks/use-patient-profile';

function toOptionalText(fieldValue: string): string | null {
  const trimmedValue = fieldValue.trim();
  return trimmedValue === '' ? null : trimmedValue;
}

export function PatientProfileScreen() {
  const { data: patientProfile, isLoading, error } = usePatientProfile();
  const { currentUser, signOut } = useAuth();

  return (
    <ScreenContainer
      title="Meu perfil"
      subtitle={
        patientProfile?.ageInYears != null ? `${patientProfile.ageInYears} anos` : undefined
      }
    >
      {isLoading && <ActivityIndicator />}
      {error && <AppText color="danger">Erro ao carregar perfil: {error.message}</AppText>}
      {patientProfile && (
        // A key reinicia o formulário quando o perfil muda (inclusive vindo do site)
        <PatientProfileForm key={patientProfile.updatedAt} patientProfile={patientProfile} />
      )}

      <View style={styles.accountRow}>
        <AppText variant="caption" color="textSecondary">
          {currentUser?.email}
        </AppText>
        <PrimaryButton label="Sair" appearance="outlined" onPress={signOut} />
      </View>
    </ScreenContainer>
  );
}

function PatientProfileForm({ patientProfile }: { patientProfile: PatientProfile }) {
  const updatePatientProfile = useUpdatePatientProfile();
  const [fullName, setFullName] = useState(patientProfile.fullName ?? '');
  const [birthDate, setBirthDate] = useState(patientProfile.birthDate ?? '');
  const [weightKg, setWeightKg] = useState(patientProfile.weightKg?.toString() ?? '');
  const [gender, setGender] = useState(patientProfile.gender ?? '');

  function handleSave() {
    const weightText = toOptionalText(weightKg);

    updatePatientProfile.mutate({
      fullName: toOptionalText(fullName),
      birthDate: toOptionalText(birthDate),
      weightKg: weightText === null ? null : Number(weightText.replace(',', '.')),
      gender: toOptionalText(gender),
    });
  }

  return (
    <Card>
      <TextField label="Nome" value={fullName} onChangeText={setFullName} />
      <TextField
        label="Data de nascimento (AAAA-MM-DD)"
        placeholder="1998-05-25"
        value={birthDate}
        onChangeText={setBirthDate}
      />
      <TextField
        label="Peso (kg)"
        keyboardType="decimal-pad"
        value={weightKg}
        onChangeText={setWeightKg}
      />
      <TextField label="Gênero" value={gender} onChangeText={setGender} />

      {updatePatientProfile.error && (
        <AppText color="danger">{updatePatientProfile.error.message}</AppText>
      )}

      <PrimaryButton
        label="Salvar"
        isLoading={updatePatientProfile.isPending}
        onPress={handleSave}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  accountRow: {
    gap: 8,
    marginTop: 8,
  },
});
