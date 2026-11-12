// apps/web/src/shared/components/layout/AppLayout.tsx
//
// Moldura comum a todas as telas logadas: menu lateral + conteúdo da página.

import { Outlet } from 'react-router';

import { useAuth } from '@/features/auth/context/use-auth';
import { SidebarNavigation } from './SidebarNavigation';

export function AppLayout() {
  const { currentUser, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="border-b border-slate-200 bg-white p-4 md:min-h-screen md:w-60 md:border-r md:border-b-0">
        <p className="mb-4 text-lg font-semibold text-violet-700">PSI Tracker</p>
        <SidebarNavigation />
        <div className="mt-6 hidden text-xs text-slate-500 md:block">
          <p className="truncate">{currentUser?.email}</p>
          <button onClick={signOut} className="mt-1 text-violet-700 hover:underline">
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
