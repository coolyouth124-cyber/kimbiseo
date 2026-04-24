'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">📊 마케팅팀 대시보드</h1>
            <p className="text-white/80">마케팅팀을 위한 통합 데이터 분석 및 업무 관리 플랫폼</p>
          </div>
          <button
            onClick={toggleTheme}
            className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-lg px-4 py-2 hover:bg-white/80 dark:hover:bg-slate-800/80 transition text-white"
          >
            {theme === 'light' ? '🌙 다크모드' : '☀️ 라이트모드'}
          </button>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">🚀 준비 중입니다</h2>
          <p className="text-white/80">Next.js 대시보드가 곧 오픈될 예정입니다.</p>
        </div>
      </div>
    </main>
  );
}
