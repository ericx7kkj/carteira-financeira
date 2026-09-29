import {
  Utensils, Home, Car, HeartPulse, GraduationCap, Gamepad2,
  Receipt, Wallet, Briefcase, Laptop, TrendingUp, Tag,
  type LucideIcon,
} from 'lucide-react';

const ICONES: Record<string, LucideIcon> = {
  Alimentação: Utensils,
  Moradia: Home,
  Transporte: Car,
  Saúde: HeartPulse,
  Educação: GraduationCap,
  Lazer: Gamepad2,
  Contas: Receipt,
  Outros: Tag,
  Salário: Briefcase,
  Freelance: Laptop,
  Investimentos: TrendingUp,
};

export function IconeCategoria({ nome, className }: { nome: string; className?: string }) {
  const Icone = ICONES[nome] ?? Wallet;
  return <Icone className={className} />;
}