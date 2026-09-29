"use server";

import { createClient } from '@/lib/supabase/server';
import { CATEGORIAS_DESPESA, CATEGORIAS_RECEITA } from '@/lib/categorias';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function lerFormulario(formData: FormData) {
  const descricao = String(formData.get('descricao') ?? '').trim();
  const valor = parseFloat(String(formData.get('valor') ?? ''));
  const tipo = String(formData.get('tipo') ?? '');
  const categoria = String(formData.get('categoria') ?? '');
  const data = String(formData.get('data') ?? '');

  if (!descricao || isNaN(valor) || valor <= 0) throw new Error('Dados inválidos.');
  if (tipo !== 'receita' && tipo !== 'despesa') throw new Error('Tipo inválido.');

  const lista = tipo === 'receita' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;
  if (!lista.includes(categoria)) throw new Error('Categoria inválida.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) throw new Error('Data inválida.');

  return { descricao, valor, tipo, categoria, data };
}

export async function criarTransacao(formData: FormData) {
  const dados = lerFormulario(formData);
  const supabase = await createClient();

  const { error } = await supabase.from('transacoes').insert([dados]);
  if (error) throw new Error('Falha ao salvar no banco de dados.');

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function atualizarTransacao(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) throw new Error('Transação inválida.');
  const dados = lerFormulario(formData);
  const supabase = await createClient();

  const { error } = await supabase.from('transacoes').update(dados).eq('id', id);
  if (error) throw new Error('Falha ao atualizar.');

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function excluirTransacao(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase.from('transacoes').delete().eq('id', id);
  if (error) throw new Error('Falha ao excluir.');

  revalidatePath('/dashboard');
}

export async function definirMeta(formData: FormData) {
  const categoria = String(formData.get('categoria') ?? '');
  const limite = parseFloat(String(formData.get('limite') ?? ''));

  if (!CATEGORIAS_DESPESA.includes(categoria)) throw new Error('Categoria inválida.');
  if (isNaN(limite) || limite <= 0) throw new Error('Limite inválido.');

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Não autenticado.');

  const { error } = await supabase
    .from('metas')
    .upsert({ user_id: auth.user.id, categoria, limite }, { onConflict: 'user_id,categoria' });
  if (error) throw new Error('Falha ao salvar meta.');

  revalidatePath('/dashboard');
}

export async function excluirMeta(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase.from('metas').delete().eq('id', id);
  if (error) throw new Error('Falha ao excluir meta.');

  revalidatePath('/dashboard');
}