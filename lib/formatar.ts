export function moeda(valor: number | string) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

// recebe "2026-09-29" e devolve "29/09/2026"
export function data(iso: string) {
  const [a, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${a}`;
}

export function hoje() {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Sao_Paulo',
  });
}

export function mesAtual() {
  return hoje().slice(0, 7);
}

export function moverMes(mes: string, delta: number) {
  const [a, m] = mes.split('-').map(Number);
  return new Date(Date.UTC(a, m - 1 + delta, 1)).toISOString().slice(0, 7);
}

export function rotuloMes(mes: string) {
  const [a, m] = mes.split('-').map(Number);
  return new Date(Date.UTC(a, m - 1, 1)).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}