import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { atualizarTransacao } from '@/app/actions/transacoes';
import { FormTransacao } from '@/app/dashboard/components/FormTransacao';

export default async function EditarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('transacoes').select('*').eq('id', id).single();

  if (!data) notFound();

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-emerald-50 via-white to-sky-50 text-slate-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <h1 className="text-2xl font-bold mt-3 mb-6">Editar transação</h1>

        <FormTransacao
          action={atualizarTransacao}
          textoBotao="Salvar alterações"
          inicial={{
            id: data.id,
            descricao: data.descricao,
            valor: data.valor,
            tipo: data.tipo,
            categoria: data.categoria,
            data: String(data.data).slice(0, 10),
          }}
        />
      </div>
    </main>
  );
}