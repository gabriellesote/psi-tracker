// apps/mobile/src/shared/hooks/use-refetch-on-app-focus.ts
//
// Rede de segurança da sincronização: quando você volta para o app
// (depois de deixá-lo em segundo plano), os dados são conferidos de novo.

import { focusManager } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';

export function useRefetchOnAppFocus() {
  useEffect(() => {
    const appStateSubscription = AppState.addEventListener('change', (appStateStatus) => {
      if (Platform.OS !== 'web') {
        focusManager.setFocused(appStateStatus === 'active');
      }
    });

    return () => appStateSubscription.remove();
  }, []);
}
