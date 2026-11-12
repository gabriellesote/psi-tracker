// apps/web/src/shared/components/layout/SidebarNavigation.tsx

import { NavLink } from 'react-router';

const navigationItems = [
  { path: '/', label: 'Diário', icon: '📅' },
  { path: '/sessoes', label: 'Sessões', icon: '🗓️' },
  { path: '/financeiro', label: 'Financeiro', icon: '💰' },
  { path: '/caderno', label: 'Caderno', icon: '📓' },
  { path: '/perfil', label: 'Meu perfil', icon: '🙂' },
] as const;

export function SidebarNavigation() {
  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col">
      {navigationItems.map((navigationItem) => (
        <NavLink
          key={navigationItem.path}
          to={navigationItem.path}
          end={navigationItem.path === '/'}
          className={({ isActive }) =>
            `flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
              isActive
                ? 'bg-violet-100 font-medium text-violet-800'
                : 'text-slate-600 hover:bg-slate-100'
            }`
          }
        >
          <span aria-hidden>{navigationItem.icon}</span>
          {navigationItem.label}
        </NavLink>
      ))}
    </nav>
  );
}
