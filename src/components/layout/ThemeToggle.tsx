'use client';

import { useTheme } from '@/hooks/useTheme';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-lg px-4 py-2 hover:bg-white/80 dark:hover:bg-slate-800/80 transition text-gray-800 dark:text-white font-medium"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
