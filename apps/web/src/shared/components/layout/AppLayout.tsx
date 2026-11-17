// apps/web/src/shared/components/layout/AppLayout.tsx
//
// Moldura comum a todas as telas logadas: menu lateral + conteúdo da página.
// Também liga a sincronização em tempo real enquanto você estiver logada.

import { LogOut } from 'lucide-react';
import { Outlet } from 'react-router';

import { useAuth } from '@/features/auth/context/use-auth';
import { useRealtimeSync } from '@/shared/hooks/use-realtime-sync';
import { SidebarNavigation } from './SidebarNavigation';

export function AppLayout() {
  const { currentUser, signOut } = useAuth();

  useRealtimeSync(currentUser?.id);

  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b border-border bg-surface p-4 md:sticky md:top-0 md:flex md:h-screen md:w-64 md:flex-col md:border-r md:border-b-0 md:p-6">
        <div className="mb-4 flex items-center gap-2 md:mb-8">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft text-xl">
            🧠
          </span>
          <span className="text-xl font-extrabold">PSI Tracker</span>
        </div>

        <SidebarNavigation />

        <div className="mt-auto hidden space-y-2 border-t border-border pt-4 text-sm md:block">
          <p className="truncate text-text-secondary">{currentUser?.email}</p>
          <button
            onClick={signOut}
            className="flex items-center gap-2 font-semibold text-primary-strong hover:underline"
          >
            <LogOut size={16} aria-hidden />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10">
        <div className="mx-auto max-w-4xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
