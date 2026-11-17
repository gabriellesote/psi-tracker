// apps/mobile/src/features/auth/context/auth-context.ts

import type { Session, User } from '@supabase/supabase-js';
import { createContext } from 'react';

import type { GoogleSignInResult } from '../services/sign-in-with-google';

export interface AuthContextValue {
  session: Session | null;
  currentUser: User | null;
  isLoadingSession: boolean;
  signInWithGoogle: () => Promise<GoogleSignInResult>;
  /** Só para desenvolvimento local, onde o login com Google não funciona no celular. */
  signInWithEmailForDevelopment: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
