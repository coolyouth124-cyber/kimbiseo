'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

import { Badge } from '@/components/common/Badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useProjects } from '@/hooks/useProjects';
import { formatCurrency } from '@/lib/format-utils';

export default function ProjectsPage() {
  const { projects, loading } = useProjects();
  const [mounted, setMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filtered = projects.filter(p => {
    if (statusFilter && p.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: projects.length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0),
    avgProgress: Math.round(
      projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
    ),
  };

  return (
    <main className="min-h-screen p-8">
      <ThemeToggle />

      <div className="max-w-6xl mx-auto">
        <Header
          title="🎯 프로젝트 관리"
          subtitle="모든 프로젝트의 진행 상황을 확인하세요"
        />
        <Navigation />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">전체</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stats.total}
                </p>
              </div>
              <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  총 예산
                </p>
                <p className="text-2xl font-bold text-blue-500">
                  {formatCurrency(stats.totalBudget)}
                </p>
              </div>
              <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  총 집행액
                </p>
                <p className="text-2xl font-bold text-orange-500">
                  {formatCurrency(stats.totalSpent)}
                </p>
              </div>
              <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  평균 진행률
                </p>
                <p className="text-3xl font-bold text-green-500">
                  {stats.avgProgress}%
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                필터
              </h3>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-800 dark:text-white"
              >
                <option value="">모든 상태</option>
                <option value="planning">계획중</option>
                <option value="in-progress">진행중</option>
                <option value="completed">완료</option>
                <option value="on-hold">보류</option>
              </select>
            </div>

            {/* Projects Grid */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                프로젝트 ({filtered.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(project => (
                  <div
                    key={project.id}
                    className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        {project.title}
                      </h3>
                      <Badge
                        variant={
                          project.status === 'completed'
                            ? 'success'
                            : project.status === 'on-hold'
                              ? 'warning'
                              : 'info'
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>

                    {project.description && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {project.description}
                      </p>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-600 dark:text-gray-300">
                          진행률
                        </span>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {project.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Budget Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          예산
                        </p>
                        <p className="font-bold text-gray-800 dark:text-white">
                          {formatCurrency(project.budget)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          집행액
                        </p>
                        <p className="font-bold text-gray-800 dark:text-white">
                          {formatCurrency(project.spent)}
                        </p>
                      </div>
                    </div>

                    {/* Team */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        팀 ({project.team.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.team.map((member, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                          >
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">
                    일치하는 프로젝트가 없습니다.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
