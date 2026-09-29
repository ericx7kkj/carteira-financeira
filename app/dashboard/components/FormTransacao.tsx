"use client";

import { useState } from 'react';
import { TrendingDown, TrendingUp, Save } from 'lucide-react';
import { CATEGORIAS_DESPESA, CATEGORIAS_RECEITA } from '@/lib/categorias';

type Inicial = {
  id?: string;
  descricao: string;
  valor: number | string;
  tipo: string;
  categoria: string;
  data: string;
};

const campo =
  'w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500';

export function FormTransacao({
  action,
  inicial,
  textoBotao,
}: {
  action: (formData: FormData) => void | Promise<void>;
  inicial: Inicial;
  textoBotao: string;
}) {
  const [tipo, setTipo] = useState(inicial.tipo);
  const [categoria, setCategoria] = useState(inicial.categoria);
  const lista = tipo === 'receita' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;

  function trocarTipo(novo: string) {
    setTipo(novo);
    const nova = novo === 'receita' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;
    if (!nova.includes(categoria)) setCategoria(nova[0]);
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      {inicial.id && <input type="hidden" name="id" value={inicial.id} />}
      <input type="hidden" name="tipo" value={tipo} />

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => trocarTipo('despesa')}
          className={`flex items-center justify-center gap-2 rounded-lg p-2.5 font-medium border transition ${
            tipo === 'despesa'
              ? 'bg-red-50 border-red-300 text-red-700'
              : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
          }`}
        >
          <TrendingDown className="h-4 w-4" /> Despesa
        </button>
        <button
          type="button"
          onClick={() => trocarTipo('receita')}
          className={`flex items-center justify-center gap-2 rounded-lg p-2.5 font-medium border transition ${
            tipo === 'receita'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="h-4 w-4" /> Receita
        </button>
      </div>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Descrição
        <input type="text" name="descricao" required defaultValue={inicial.descricao} className={campo} />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Valor (R$)
        <input
          type="number"
          name="valor"
          step="0.01"
          min="0.01"
          required
          defaultValue={inicial.valor}
          className={campo}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Categoria
        <select
          name="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className={campo}
        >
          {lista.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Data
        <input type="date" name="data" required defaultValue={inicial.data} className={campo} />
      </label>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg p-2.5 transition"
      >
        <Save className="h-4 w-4" /> {textoBotao}
      </button>
    </form>
  );
}