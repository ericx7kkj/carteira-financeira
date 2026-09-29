"use server";

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function entrar(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get('email') ?? '').trim(),
    password: String(formData.get('senha') ?? ''),
  });

  if (error) {
    redirect('/login?erro=' + encodeURIComponent('E-mail ou senha incorretos.'));
  }
  redirect('/dashboard');
}

export async function cadastrar(formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: String(formData.get('email') ?? '').trim(),
    password: String(formData.get('senha') ?? ''),
  });

  if (error) {
    redirect(
      '/login?modo=cadastro&erro=' +
        encodeURIComponent('Não foi possível criar a conta. Verifique os dados.')
    );
  }
  if (!data.session) {
    redirect('/login?aviso=' + encodeURIComponent('Conta criada. Confirme seu e-mail para entrar.'));
  }
  redirect('/dashboard');
}

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}