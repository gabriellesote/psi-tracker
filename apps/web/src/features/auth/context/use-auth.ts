// apps/web/src/features/auth/context/use-auth.ts

import { useContext } from 'react';

import { AuthContext } from './auth-context';

export function useAuth() {
  const authContextValue = useContext(AuthContext);

  if (!authContextValue) {
    throw new Error('useAuth precisa ser usado dentro de <AuthProvider>');
  }

  return authContextValue;
}
