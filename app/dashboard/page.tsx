import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { sair } from '@/app/login/actions';
import { moeda } from '@/lib/formatar';
import { CardTransacao } from './components/CardTransacao';

export const dynamic = 'force-dynamic';

async function getTransacoes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('transacoes')
    .select('*')
    .order('criado_em', { ascending: false });

  if (error) throw new Error('Erro ao buscar transações');
  return data ?? [];
}

export default async function DashboardPage() {
  const transacoes = await getTransacoes();

  const receitas = transacoes
    .filter((t) => t.tipo === 'receita')
    .reduce((acc, t) => acc + Number(t.valor), 0);

  const despesas = transacoes
    .filter((t) => t.tipo === 'despesa')
    .reduce((acc, t) => acc + Number(t.valor), 0);

  const saldo = receitas - despesas;

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 text-slate-900">
      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-emerald-600 text-white grid place-items-center font-bold">
              $
            </div>
            <span className="text-lg font-semibold">FinanceWallet</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/nova-transacao"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md px-4 py-2 transition"
            >
              + Nova transação
            </Link>
            <form action={sair}>
              <button
                type="submit"
                className="border border-slate-300 bg-white hover:bg-slate-50 rounded-md px-4 py-2 transition"
              >
                Sair
              </button>
            </form>
          </div>
        </header>

        <h1 className="text-2xl font-bold mb-4">Minha carteira</h1>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <p className="text-sm text-slate-500">Saldo atual</p>
            <p
              className={`text-3xl font-bold mt-1 ${
                saldo >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {moeda(saldo)}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <p className="text-sm text-slate-500">Total de receitas</p>
            <p className="text-3xl font-bold mt-1 text-emerald-600">
              ▲ {moeda(receitas)}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <p className="text-sm text-slate-500">Total de despesas</p>
            <p className="text-3xl font-bold mt-1 text-red-600">
              ▼ {moeda(despesas)}
            </p>
          </div>
        </section>

        <h2 className="text-lg font-semibold mb-3">Histórico</h2>

        <div className="space-y-3">
          {transacoes.length === 0 && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              Nenhuma transação ainda. Clique em &quot;+ Nova transação&quot; para começar.
            </div>
          )}
          {transacoes.map((t) => (
            <CardTransacao key={t.id} data={t} />
          ))}
        </div>
      </div>
    </main>
  );
}