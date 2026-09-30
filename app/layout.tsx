import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Carteira Financeira',
  description: 'Controle suas receitas e despesas.',
};

const scriptTema = `
try {
  var t = localStorage.getItem('tema');
  document.documentElement.dataset.theme = t === 'light' ? 'light' : 'dark';
} catch (e) {
  document.documentElement.dataset.theme = 'dark';
}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body>{children}</body>
    </html>
  );
}