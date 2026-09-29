import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { data as formatarData, mesAtual, moverMes } from '@/lib/formatar';

function celula(valor: string | number) {
  let texto = String(valor);
  if (/^[=+\-@]/.test(texto)) texto = "'" + texto; // evita fórmula no Excel
  return `"${texto.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  const param = request.nextUrl.searchParams.get('mes') ?? '';
  const mes = /^\d{4}-(0[1-9]|1[0-2])$/.test(param) ? param : mesAtual();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('transacoes')
    .select('*')
    .gte('data', `${mes}-01`)
    .lt('data', `${moverMes(mes, 1)}-01`)
    .order('data');

  if (error) return new Response('Erro ao exportar', { status: 500 });

  const linhas = [
    ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor'].map(celula).join(';'),
    ...(data ?? []).map((t) =>
      [
        formatarData(t.data),
        t.descricao,
        t.categoria,
        t.tipo,
        String(t.valor).replace('.', ','),
      ]
        .map(celula)
        .join(';')
    ),
  ];

  return new Response('\uFEFF' + linhas.join('\r\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="extrato-${mes}.csv"`,
    },
  });
}