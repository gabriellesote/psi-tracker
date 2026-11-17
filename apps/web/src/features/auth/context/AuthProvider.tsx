// apps/web/src/features/auth/context/AuthProvider.tsx
//
// Guarda a sessão do usuário e disponibiliza login/logout para qualquer
// componente via `useAuth()`. A sessão salva no navegador é recuperada ao abrir o site.

import type { Session } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { supabaseClient } from '@/shared/lib/supabase-client';
import { AuthContext, type AuthContextValue } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoadingSession(false);
    });

    const { data: authListener } = supabaseClient.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const authContextValue = useMemo<AuthContextValue>(
    () => ({
      session,
      currentUser: session?.user ?? null,
      isLoadingSession,
      signInWithGoogle: async () => {
        const { error } = await supabaseClient.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin },
        });
        if (error) throw error;
      },
      signInWithEmailForDevelopment: async (email, password) => {
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      signUpWithEmailForDevelopment: async (email, password) => {
        const { error } = await supabaseClient.auth.signUp({ email, password });
        if (error) throw error;
      },
      signOut: async () => {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        queryClient.clear(); // não deixa dados do usuário anterior no cache
      },
    }),
    [session, isLoadingSession, queryClient],
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}
