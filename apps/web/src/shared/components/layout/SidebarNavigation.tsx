// apps/web/src/shared/components/layout/SidebarNavigation.tsx

import { NavLink } from 'react-router';

import { navigationItems } from './navigation-items';

export function SidebarNavigation() {
  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col">
      {navigationItems.map(({ path, label, Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          className={({ isActive }) =>
            `flex items-center gap-3 whitespace-nowrap rounded-full px-4 py-2.5 font-semibold transition ${
              isActive
                ? 'bg-primary-soft text-primary-strong'
                : 'text-text-secondary hover:bg-surface-muted'
            }`
          }
        >
          <Icon size={20} strokeWidth={2.2} aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
