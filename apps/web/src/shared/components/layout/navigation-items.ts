// apps/web/src/shared/components/layout/navigation-items.ts
//
// As cinco frentes do site, na mesma ordem das abas do app.

import {
  BookHeart,
  CalendarHeart,
  MessagesSquare,
  UserRound,
  WalletCards,
  type LucideIcon,
} from 'lucide-react';

export interface NavigationItem {
  path: string;
  label: string;
  Icon: LucideIcon;
}

export const navigationItems: NavigationItem[] = [
  { path: '/', label: 'Diário', Icon: CalendarHeart },
  { path: '/sessoes', label: 'Sessões', Icon: MessagesSquare },
  { path: '/financeiro', label: 'Financeiro', Icon: WalletCards },
  { path: '/caderno', label: 'Caderno', Icon: BookHeart },
  { path: '/perfil', label: 'Meu perfil', Icon: UserRound },
];
