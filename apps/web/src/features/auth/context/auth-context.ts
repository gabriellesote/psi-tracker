// apps/web/src/features/auth/context/auth-context.ts

import type { Session, User } from '@supabase/supabase-js';
import { createContext } from 'react';

export interface AuthContextValue {
  session: Session | null;
  currentUser: User | null;
  isLoadingSession: boolean;
  /** Redireciona para o Google e volta logada para o site. */
  signInWithGoogle: () => Promise<void>;
  /** Login por e-mail: usado só no desenvolvimento local (ex.: para testar no celular). */
  signInWithEmailForDevelopment: (email: string, password: string) => Promise<void>;
  signUpWithEmailForDevelopment: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
