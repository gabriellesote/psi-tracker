// apps/mobile/src/app/auth/callback.tsx
//
// Endereço para onde o Google devolve o usuário (psitracker://auth/callback).
// A troca do código pela sessão já é feita em sign-in-with-google.ts;
// esta rota só existe para o app não mostrar "página não encontrada" e voltar ao início.

import { Redirect } from 'expo-router';

export default function AuthCallbackRoute() {
  return <Redirect href="/" />;
}
