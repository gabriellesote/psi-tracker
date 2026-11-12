// apps/web/src/features/patient-profile/hooks/use-patient-profile.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchMyPatientProfile, updateMyPatientProfile } from '../api/patient-profile.api';

export const patientProfileQueryKey = ['patient-profile', 'me'] as const;

export function usePatientProfile() {
  return useQuery({
    queryKey: patientProfileQueryKey,
    queryFn: fetchMyPatientProfile,
  });
}

export function useUpdatePatientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyPatientProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(patientProfileQueryKey, updatedProfile);
    },
  });
}
