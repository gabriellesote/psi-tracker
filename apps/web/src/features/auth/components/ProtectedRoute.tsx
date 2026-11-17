// apps/web/src/features/auth/components/ProtectedRoute.tsx
//
// Só deixa passar quem está logado; os demais vão para /login.

import { Navigate, Outlet } from 'react-router';

import { useAuth } from '../context/use-auth';

export function ProtectedRoute() {
  const { session, isLoadingSession } = useAuth();

  if (isLoadingSession) {
    return <p className="p-8 text-text-secondary">Carregando…</p>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
