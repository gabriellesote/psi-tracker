// apps/web/src/features/auth/pages/LoginPage.tsx

import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router';

import { GoogleLogo } from '../components/GoogleLogo';
import { useAuth } from '../context/use-auth';

export function LoginPage() {
  const { session, signInWithGoogle } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRedirectingToGoogle, setIsRedirectingToGoogle] = useState(false);

  if (session) {
    return <Navigate to="/" replace />;
  }

  async function handleGoogleSignIn() {
    setErrorMessage(null);
    setIsRedirectingToGoogle(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível entrar');
      setIsRedirectingToGoogle(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-soft via-background to-accent-sky/30 px-4">
      <section className="w-full max-w-sm space-y-6 rounded-large bg-surface p-8 text-center shadow-xl shadow-primary/10 ring-1 ring-border">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary-soft text-4xl">
          🧠
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold">PSI Tracker</h1>
          <p className="text-text-secondary">
            Seu cantinho para acompanhar a terapia, o humor e o autocuidado.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isRedirectingToGoogle}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-surface px-4 py-3 font-bold transition hover:bg-surface-muted disabled:opacity-60"
        >
          <GoogleLogo />
          {isRedirectingToGoogle ? 'Abrindo o Google…' : 'Continuar com Google'}
        </button>

        {errorMessage && <p className="text-sm text-danger">{errorMessage}</p>}

        {import.meta.env.DEV && <DevelopmentEmailLoginForm />}
      </section>
    </main>
  );
}

/**
 * Login por e-mail que só aparece no ambiente de desenvolvimento.
 * Serve para testar no celular com o Supabase local, onde o Google não aceita o login.
 */
function DevelopmentEmailLoginForm() {
  const { signInWithEmailForDevelopment, signUpWithEmailForDevelopment } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submitCredentials(wantsToCreateAccount: boolean) {
    setErrorMessage(null);
    try {
      if (wantsToCreateAccount) {
        await signUpWithEmailForDevelopment(email, password);
      } else {
        await signInWithEmailForDevelopment(email, password);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível entrar');
    }
  }

  const inputClassName =
    'w-full rounded-medium border border-border bg-surface-muted px-3 py-2 outline-primary';

  return (
    <details className="rounded-medium bg-surface-muted/60 p-3 text-left text-sm">
      <summary className="cursor-pointer font-semibold text-text-secondary">
        Só no desenvolvimento: entrar com e-mail
      </summary>
      <form
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          void submitCredentials(false);
        }}
        className="mt-3 space-y-2"
      >
        <input
          type="email"
          required
          placeholder="E-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClassName}
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClassName}
        />
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 rounded-full bg-primary py-2 font-bold text-text-on-primary"
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={(event) => {
              if (event.currentTarget.form?.reportValidity()) void submitCredentials(true);
            }}
            className="flex-1 rounded-full border border-border py-2 font-bold"
          >
            Criar conta
          </button>
        </div>
      </form>
    </details>
  );
}
