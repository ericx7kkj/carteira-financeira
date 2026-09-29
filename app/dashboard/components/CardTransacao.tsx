"use client";

import { moeda, data as formatarData } from '@/lib/formatar';

type Transacao = {
  id: string;
  descricao: string;
  valor: number | string;
  tipo: string;
  criado_em: string;
};

export function CardTransacao({ data }: { data: Transacao }) {
  const isReceita = data.tipo === 'receita';

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`h-10 w-10 rounded-full grid place-items-center font-bold ${
            isReceita ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {isReceita ? '▲' : '▼'}
        </div>
        <div>
          <p className="font-medium text-slate-900">{data.descricao}</p>
          <p className="text-xs text-slate-500">
            {isReceita ? 'Receita' : 'Despesa'} · {formatarData(data.criado_em)}
          </p>
        </div>
      </div>

      <span
        className={`font-bold ${isReceita ? 'text-emerald-600' : 'text-red-600'}`}
      >
        {isReceita ? '+' : '-'} {moeda(data.valor)}
      </span>
    </div>
  );
}