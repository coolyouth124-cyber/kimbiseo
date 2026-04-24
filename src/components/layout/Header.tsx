'use client';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
      {subtitle && <p className="text-white/80 text-lg">{subtitle}</p>}
    </div>
  );
}
