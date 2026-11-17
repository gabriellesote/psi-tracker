// apps/web/src/main.tsx
//
// Ponto de entrada do React.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

import { AppProviders } from '@/app/AppProviders';
import { router } from '@/app/router';
import { applyDesignTokensToDocument } from '@/shared/theme/apply-design-tokens';
import '@/styles/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento #root não encontrado no index.html');
}

applyDesignTokensToDocument();

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
);
