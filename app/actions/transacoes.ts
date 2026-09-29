"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function criarTransacao(formData: FormData) {
  const descricao = String(formData.get('descricao') ?? '').trim();
  const valor = parseFloat(String(formData.get('valor') ?? ''));
  const tipo = String(formData.get('tipo') ?? '');

  if (!descricao || isNaN(valor) || valor <= 0) {
    throw new Error('Dados inválidos.');
  }
  if (tipo !== 'receita' && tipo !== 'despesa') {
    throw new Error('Tipo inválido.');
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('transacoes')
    .insert([{ descricao, valor, tipo }]);

  if (error) {
    throw new Error('Falha ao salvar no banco de dados.');
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}