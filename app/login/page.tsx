import Link from 'next/link';
import { entrar, cadastrar } from './actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ modo?: string; erro?: string; aviso?: string }>;
}) {
  const { modo, erro, aviso } = await searchParams;
  const cadastro = modo === 'cadastro';

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-emerald-50 via-white to-sky-50 text-slate-900">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-lg bg-emerald-600 text-white grid place-items-center font-bold">
            $
          </div>
          <span className="text-lg font-semibold">FinanceWallet</span>
        </div>

        <h1 className="text-2xl font-bold">
          {cadastro ? 'Criar conta' : 'Bem-vindo de volta'}
        </h1>
        <p className="text-slate-500 text-sm mt-1 mb-6">
          {cadastro
            ? 'Cadastre-se para controlar suas finanças.'
            : 'Entre para ver sua carteira.'}
        </p>

        {erro && (
          <p className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm p-3">
            {erro}
          </p>
        )}
        {aviso && (
          <p className="mb-4 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm p-3">
            {aviso}
          </p>
        )}

        <form
          action={cadastro ? cadastrar : entrar}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1 text-sm font-medium">
            E-mail
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="border border-slate-300 rounded-md p-2 bg-white text-slate-900 font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            Senha
            <input
              type="password"
              name="senha"
              required
              minLength={6}
              autoComplete={cadastro ? 'new-password' : 'current-password'}
              className="border border-slate-300 rounded-md p-2 bg-white text-slate-900 font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </label>

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md p-2 transition"
          >
            {cadastro ? 'Criar conta' : 'Entrar'}
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-6">
          {cadastro ? 'Já tem conta? ' : 'Ainda não tem conta? '}
          <Link
            href={cadastro ? '/login' : '/login?modo=cadastro'}
            className="text-emerald-700 font-semibold hover:underline"
          >
            {cadastro ? 'Entrar' : 'Criar conta'}
          </Link>
        </p>
      </div>
    </main>
  );
}