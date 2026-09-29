"use client";

import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { moeda, data as formatarData } from '@/lib/formatar';
import { COR } from '@/lib/categorias';
import { excluirTransacao } from '@/app/actions/transacoes';
import { IconeCategoria } from './IconeCategoria';

export type Transacao = {
  id: string;
  descricao: string;
  valor: number | string;
  tipo: string;
  categoria: string;
  data: string;
};

export function CardTransacao({ data }: { data: Transacao }) {
  const isReceita = data.tipo === 'receita';
  const cor = COR[data.categoria] ?? '#64748b';

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="h-11 w-11 shrink-0 rounded-full grid place-items-center"
          style={{ backgroundColor: `${cor}22`, color: cor }}
        >
          <IconeCategoria nome={data.categoria} className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-slate-900 truncate">{data.descricao}</p>
          <p className="text-xs text-slate-500">
            {data.categoria} · {formatarData(data.data)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <span className={`font-bold mr-2 ${isReceita ? 'text-emerald-600' : 'text-red-600'}`}>
          {isReceita ? '+' : '-'} {moeda(data.valor)}
        </span>
        <Link
          href={`/dashboard/editar/${data.id}`}
          title="Editar"
          className="p-2 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition"
        >
          <Pencil className="h-4 w-4" />
        </Link>
        <form
          action={excluirTransacao}
          onSubmit={(e) => {
            if (!confirm('Excluir esta transação?')) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={data.id} />
          <button
            type="submit"
            title="Excluir"
            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}