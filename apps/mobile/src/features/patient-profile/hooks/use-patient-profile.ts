// apps/mobile/src/features/patient-profile/hooks/use-patient-profile.ts

import { queryKeys } from '@psi-tracker/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/shared/lib/api-client';

export function usePatientProfile() {
  return useQuery({
    queryKey: queryKeys.patientProfile,
    queryFn: apiClient.patientProfile.getMine,
  });
}

export function useUpdatePatientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.patientProfile.updateMine,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(queryKeys.patientProfile, updatedProfile);
    },
  });
}
