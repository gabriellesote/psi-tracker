// apps/web/src/features/auth/context/AuthProvider.tsx
//
// Guarda a sessão do usuário logado e disponibiliza login/cadastro/logout
// para qualquer componente via `useAuth()`.

import type { Session } from '@supabase/supabase-js';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { supabaseClient } from '@/shared/lib/supabase-client';
import { AuthContext, type AuthContextValue } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
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
      signIn: async (email, password) => {
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      signUp: async (email, password) => {
        const { error } = await supabaseClient.auth.signUp({ email, password });
        if (error) throw error;
      },
      signOut: async () => {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
      },
    }),
    [session, isLoadingSession],
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
}
