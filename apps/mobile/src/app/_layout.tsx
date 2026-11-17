// apps/mobile/src/app/_layout.tsx
//
// Layout raiz do app:
//   - carrega fontes e a sessão salva (com a splash screen visível até terminar)
//   - liga a sincronização em tempo real
//   - decide quais telas aparecem: logado → abas | deslogado → tela de login

import { colorTokens } from '@psi-tracker/shared';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { useAuth } from '@/features/auth/context/use-auth';
import { useRealtimeSync } from '@/shared/hooks/use-realtime-sync';
import { useRefetchOnAppFocus } from '@/shared/hooks/use-refetch-on-app-focus';
import { queryClient } from '@/shared/lib/query-client';
import { nunitoFontFiles } from '@/shared/theme/fonts';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function RootNavigator() {
  const { session, currentUser, isLoadingSession } = useAuth();
  const [haveFontsLoaded] = useFonts(nunitoFontFiles);
  const isAppReady = haveFontsLoaded && !isLoadingSession;
  const isSignedIn = session !== null;

  useRealtimeSync(currentUser?.id);
  useRefetchOnAppFocus();

  useEffect(() => {
    if (isAppReady) void SplashScreen.hideAsync();
  }, [isAppReady]);

  if (!isAppReady) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colorTokens.background },
      }}
    >
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>

      <Stack.Screen name="auth/callback" />
    </Stack>
  );
}
