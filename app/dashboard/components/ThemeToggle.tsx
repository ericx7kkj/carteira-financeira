"use client";

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [tema, setTema] = useState<'dark' | 'light' | null>(null);

  useEffect(() => {
    setTema(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  }, []);

  function alternar() {
    const novo = tema === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = novo;
    try {
      localStorage.setItem('tema', novo);
    } catch {}
    setTema(novo);
  }

  return (
    <button
      type="button"
      onClick={alternar}
      title={tema === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      aria-label="Alternar tema"
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition"
    >
      {tema === 'dark' ? (
        <Sun className="h-4 w-4 text-amber-400" />
      ) : tema === 'light' ? (
        <Moon className="h-4 w-4 text-slate-600" />
      ) : null}
    </button>
  );
}