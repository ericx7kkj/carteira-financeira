import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { criarTransacao } from '@/app/actions/transacoes';
import { hoje } from '@/lib/formatar';
import { FormTransacao } from '../components/FormTransacao';

export default function NovaTransacaoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-emerald-50 via-white to-sky-50 text-slate-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <h1 className="text-2xl font-bold mt-3">Nova transação</h1>
        <p className="text-slate-500 text-sm mt-1 mb-6">Registre uma receita ou despesa.</p>

        <FormTransacao
          action={criarTransacao}
          textoBotao="Salvar"
          inicial={{
            descricao: '',
            valor: '',
            tipo: 'despesa',
            categoria: 'Alimentação',
            data: hoje(),
          }}
        />
      </div>
    </main>
  );
}