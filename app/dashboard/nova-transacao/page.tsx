import Link from 'next/link';
import { criarTransacao } from '@/app/actions/transacoes';

const campo =
  'border border-slate-300 rounded-md p-2 bg-white text-slate-900 font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500';

export default function NovaTransacaoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-emerald-50 via-white to-sky-50 text-slate-900">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <Link
          href="/dashboard"
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Voltar
        </Link>

        <h1 className="text-2xl font-bold mt-3">Nova transação</h1>
        <p className="text-slate-500 text-sm mt-1 mb-6">
          Registre uma receita ou despesa.
        </p>

        <form action={criarTransacao} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Descrição
            <input type="text" name="descricao" required className={campo} />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            Valor (R$)
            <input
              type="number"
              name="valor"
              step="0.01"
              min="0.01"
              required
              className={campo}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            Tipo
            <select name="tipo" className={campo}>
              <option value="despesa">Despesa</option>
              <option value="receita">Receita</option>
            </select>
          </label>

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md p-2 transition"
          >
            Salvar
          </button>
        </form>
      </div>
    </main>
  );
}