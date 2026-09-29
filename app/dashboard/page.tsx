import Link from 'next/link';
import {
  Wallet, Plus, LogOut, TrendingUp, TrendingDown, ChevronLeft, ChevronRight,
  Download, Search, Target, Trash2, AlertTriangle, Scale,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { sair } from '@/app/login/actions';
import { definirMeta, excluirMeta } from '@/app/actions/transacoes';
import { moeda, mesAtual, moverMes, rotuloMes } from '@/lib/formatar';
import { CATEGORIAS_DESPESA, COR } from '@/lib/categorias';
import { CardTransacao, type Transacao } from './components/CardTransacao';
import { IconeCategoria } from './components/IconeCategoria';

export const dynamic = 'force-dynamic';

type Meta = { id: string; categoria: string; limite: number | string };

const btnSec =
  'inline-flex items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg px-3 py-2 text-sm font-medium transition';
const campo =
  'border border-slate-300 rounded-lg p-2 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500';

async function getDados() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  const { data: transacoes, error } = await supabase
    .from('transacoes')
    .select('*')
    .order('data', { ascending: false })
    .order('criado_em', { ascending: false });
  if (error) throw new Error('Erro ao buscar transações');

  const { data: metas } = await supabase.from('metas').select('*').order('categoria');

  return {
    email: auth.user?.email ?? '',
    transacoes: (transacoes ?? []) as Transacao[],
    metas: (metas ?? []) as Meta[],
  };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; q?: string; tipo?: string }>;
}) {
  const { mes: mesParam, q = '', tipo = '' } = await searchParams;
  const mes = /^\d{4}-(0[1-9]|1[0-2])$/.test(mesParam ?? '') ? (mesParam as string) : mesAtual();

  const { email, transacoes, metas } = await getDados();

  const soma = (lista: Transacao[], t: string) =>
    lista.filter((x) => x.tipo === t).reduce((acc, x) => acc + Number(x.valor), 0);

  const saldo = soma(transacoes, 'receita') - soma(transacoes, 'despesa');

  const doMes = transacoes.filter((t) => t.data.slice(0, 7) === mes);
  const receitas = soma(doMes, 'receita');
  const despesas = soma(doMes, 'despesa');
  const balanco = receitas - despesas;

  const gastoPorCat = new Map<string, number>();
  doMes
    .filter((t) => t.tipo === 'despesa')
    .forEach((t) => gastoPorCat.set(t.categoria, (gastoPorCat.get(t.categoria) ?? 0) + Number(t.valor)));
  const categorias = [...gastoPorCat.entries()].sort((a, b) => b[1] - a[1]);

  let acumulado = 0;
  const fatias = categorias.map(([nome, valor]) => {
    const ini = acumulado;
    acumulado += (valor / despesas) * 100;
    return `${COR[nome] ?? '#64748b'} ${ini}% ${acumulado}%`;
  });

  const estouradas = metas.filter((m) => (gastoPorCat.get(m.categoria) ?? 0) > Number(m.limite));

  const termo = q.trim().toLowerCase();
  const extrato = doMes.filter(
    (t) =>
      (!tipo || t.tipo === tipo) &&
      (!termo ||
        t.descricao.toLowerCase().includes(termo) ||
        t.categoria.toLowerCase().includes(termo))
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 text-slate-900">
      <div className="max-w-5xl mx-auto p-6 sm:p-8">
        {/* Cabeçalho */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white grid place-items-center">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">Carteira Financeira</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-sm text-slate-500 mr-1">{email}</span>
            <Link
              href="/dashboard/nova-transacao"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg px-4 py-2 transition"
            >
              <Plus className="h-4 w-4" /> Nova transação
            </Link>
            <form action={sair}>
              <button type="submit" className={btnSec}>
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </form>
          </div>
        </header>

        {/* Saldo */}
        <section className="rounded-2xl p-6 mb-6 text-white bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg">
          <p className="text-emerald-100 text-sm">Saldo atual</p>
          <p className="text-4xl font-bold mt-1">{moeda(saldo)}</p>
          <p className="text-emerald-100 text-xs mt-2">Soma de todos os meses</p>
        </section>

        {/* Alerta de metas */}
        {estouradas.length > 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 text-red-800 p-4 mb-6">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="text-sm">
              Você ultrapassou a meta em: <strong>{estouradas.map((m) => m.categoria).join(', ')}</strong>.
            </p>
          </div>
        )}

        {/* Navegação de mês */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold capitalize">{rotuloMes(mes)}</h2>
          <div className="flex items-center gap-2">
            <Link href={`/dashboard?mes=${moverMes(mes, -1)}`} className={btnSec} title="Mês anterior">
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <Link href="/dashboard" className={btnSec}>Hoje</Link>
            <Link href={`/dashboard?mes=${moverMes(mes, 1)}`} className={btnSec} title="Próximo mês">
              <ChevronRight className="h-4 w-4" />
            </Link>
            <a href={`/dashboard/exportar?mes=${mes}`} className={btnSec}>
              <Download className="h-4 w-4" /> CSV
            </a>
          </div>
        </div>

        {/* Resumo do mês */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center">
                <TrendingUp className="h-4 w-4" />
              </span>
              Receitas
            </div>
            <p className="text-2xl font-bold mt-2 text-emerald-600">{moeda(receitas)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="h-8 w-8 rounded-full bg-red-100 text-red-700 grid place-items-center">
                <TrendingDown className="h-4 w-4" />
              </span>
              Despesas
            </div>
            <p className="text-2xl font-bold mt-2 text-red-600">{moeda(despesas)}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="h-8 w-8 rounded-full bg-sky-100 text-sky-700 grid place-items-center">
                <Scale className="h-4 w-4" />
              </span>
              Balanço do mês
            </div>
            <p className={`text-2xl font-bold mt-2 ${balanco >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {moeda(balanco)}
            </p>
          </div>
        </section>

        {/* Gráfico e metas */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold mb-4">Gastos por categoria</h3>
            {categorias.length === 0 ? (
              <p className="text-sm text-slate-500">Sem despesas neste mês.</p>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div
                  className="relative h-36 w-36 shrink-0 rounded-full"
                  style={{ background: `conic-gradient(${fatias.join(', ')})` }}
                >
                  <div className="absolute inset-5 rounded-full bg-white grid place-items-center text-center">
                    <span className="text-xs text-slate-500 leading-tight">
                      Total<br />
                      <strong className="text-sm text-slate-900">{moeda(despesas)}</strong>
                    </span>
                  </div>
                </div>
                <ul className="w-full space-y-2">
                  {categorias.map(([nome, valor]) => (
                    <li key={nome} className="flex items-center justify-between text-sm gap-2">
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COR[nome] ?? '#64748b' }} />
                        {nome}
                      </span>
                      <span className="text-slate-500">
                        {moeda(valor)} · {Math.round((valor / despesas) * 100)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-600" /> Metas de gasto
            </h3>

            <form action={definirMeta} className="flex flex-wrap gap-2 mb-4">
              <select name="categoria" className={campo}>
                {CATEGORIAS_DESPESA.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="number"
                name="limite"
                step="0.01"
                min="0.01"
                required
                placeholder="Limite mensal (R$)"
                className={`${campo} flex-1 min-w-[120px]`}
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg px-3 py-2 transition"
              >
                Definir
              </button>
            </form>

            {metas.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma meta ainda. Defina um limite por categoria.</p>
            ) : (
              <div className="space-y-4">
                {metas.map((m) => {
                  const gasto = gastoPorCat.get(m.categoria) ?? 0;
                  const limite = Number(m.limite);
                  const pct = (gasto / limite) * 100;
                  const cor = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-400' : 'bg-emerald-500';
                  return (
                    <div key={m.id}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <IconeCategoria nome={m.categoria} className="h-4 w-4 text-slate-500" />
                          {m.categoria}
                        </span>
                        <span className="flex items-center gap-2 text-slate-500">
                          {moeda(gasto)} / {moeda(limite)}
                          <form action={excluirMeta}>
                            <input type="hidden" name="id" value={m.id} />
                            <button type="submit" title="Remover meta" className="hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </form>
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className={`h-2 rounded-full ${cor}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Extrato */}
        <h2 className="text-lg font-semibold mb-3">Extrato</h2>

        <form className="flex flex-wrap gap-2 mb-4">
          <input type="hidden" name="mes" value={mes} />
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Buscar por descrição ou categoria"
              className={`${campo} w-full pl-9`}
            />
          </div>
          <select name="tipo" defaultValue={tipo} className={campo}>
            <option value="">Todos</option>
            <option value="receita">Receitas</option>
            <option value="despesa">Despesas</option>
          </select>
          <button type="submit" className={btnSec}>Filtrar</button>
          {(q || tipo) && (
            <Link href={`/dashboard?mes=${mes}`} className={btnSec}>Limpar</Link>
          )}
        </form>

        <div className="space-y-3">
          {extrato.length === 0 && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              Nenhuma transação encontrada.
            </div>
          )}
          {extrato.map((t) => (
            <CardTransacao key={t.id} data={t} />
          ))}
        </div>
      </div>
    </main>
  );
}