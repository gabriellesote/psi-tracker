// apps/web/src/features/auth/pages/LoginPage.tsx

import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router';

import { useAuth } from '../context/use-auth';

type AuthFormMode = 'sign-in' | 'sign-up';

export function LoginPage() {
  const { session, signIn, signUp } = useAuth();
  const [formMode, setFormMode] = useState<AuthFormMode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (session) {
    return <Navigate to="/" replace />;
  }

  const isSignUpMode = formMode === 'sign-up';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (isSignUpMode) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível entrar');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
      >
        <h1 className="text-2xl font-semibold text-slate-800">
          {isSignUpMode ? 'Criar conta' : 'Entrar no PSI Tracker'}
        </h1>

        <label className="block space-y-1">
          <span className="text-sm text-slate-600">E-mail</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-violet-500"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm text-slate-600">Senha</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-violet-500"
          />
        </label>

        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-violet-600 py-2 font-medium text-white hover:bg-violet-700 disabled:opacity-60"
        >
          {isSubmitting ? 'Aguarde…' : isSignUpMode ? 'Cadastrar' : 'Entrar'}
        </button>

        <button
          type="button"
          onClick={() => setFormMode(isSignUpMode ? 'sign-in' : 'sign-up')}
          className="w-full text-sm text-violet-700 hover:underline"
        >
          {isSignUpMode ? 'Já tenho conta' : 'Ainda não tenho conta'}
        </button>
      </form>
    </main>
  );
}
