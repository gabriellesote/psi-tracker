// apps/mobile/src/features/auth/services/sign-in-with-google.ts
//
// Login com Google no celular:
//   1. O Supabase gera a URL de login do Google
//   2. Abrimos essa URL num navegador seguro dentro do app
//   3. O Google devolve para o app (psitracker://auth/callback) com um "code"
//   4. Trocamos esse code por uma sessão, que fica salva no aparelho

import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { supabaseClient } from '@/shared/lib/supabase-client';

WebBrowser.maybeCompleteAuthSession();

export type GoogleSignInResult = 'signed-in' | 'cancelled';

export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  const appRedirectUrl = Linking.createURL('auth/callback');

  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: appRedirectUrl, skipBrowserRedirect: true },
  });
  if (error) throw error;

  const browserResult = await WebBrowser.openAuthSessionAsync(data.url, appRedirectUrl);
  if (browserResult.type !== 'success') return 'cancelled';

  const { queryParams } = Linking.parse(browserResult.url);
  const providerErrorDescription = queryParams?.error_description;
  if (typeof providerErrorDescription === 'string') {
    throw new Error(providerErrorDescription);
  }

  const authorizationCode = queryParams?.code;
  if (typeof authorizationCode !== 'string') {
    throw new Error('O Google não devolveu o código de login. Tente novamente.');
  }

  const { error: exchangeError } =
    await supabaseClient.auth.exchangeCodeForSession(authorizationCode);
  if (exchangeError) throw exchangeError;

  return 'signed-in';
}
