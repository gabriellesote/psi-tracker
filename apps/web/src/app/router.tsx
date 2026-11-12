// apps/web/src/app/router.tsx
//
// Mapa de todas as telas do site.

import { createBrowserRouter } from 'react-router';

import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { DailyJournalPage } from '@/features/daily-journal/pages/DailyJournalPage';
import { FinancePage } from '@/features/finance/pages/FinancePage';
import { NotebookPage } from '@/features/notebook/pages/NotebookPage';
import { PatientProfilePage } from '@/features/patient-profile/pages/PatientProfilePage';
import { TherapySessionsPage } from '@/features/therapy-sessions/pages/TherapySessionsPage';
import { AppLayout } from '@/shared/components/layout/AppLayout';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DailyJournalPage /> },
          { path: 'sessoes', element: <TherapySessionsPage /> },
          { path: 'financeiro', element: <FinancePage /> },
          { path: 'caderno', element: <NotebookPage /> },
          { path: 'perfil', element: <PatientProfilePage /> },
        ],
      },
    ],
  },
]);
