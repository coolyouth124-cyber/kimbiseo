'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { TaskCard } from '@/components/cards/TaskCard';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useTasks } from '@/hooks/useTasks';


export default function TasksPage() {
  const { tasks, loading } = useTasks();
  const [mounted, setMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filtered = tasks.filter(task => {
    if (statusFilter && task.status !== statusFilter) return false;
    if (priorityFilter && task.priority !== priorityFilter) return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <main className="min-h-screen p-8">
      <ThemeToggle />

      <div className="max-w-6xl mx-auto">
        <Header title="✅ 할일 관리" subtitle="모든 업무를 한눈에 관리하세요" />
        <Navigation />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">전체</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stats.total}
                </p>
              </div>
              <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">대기</p>
                <p className="text-3xl font-bold text-orange-500">{stats.pending}</p>
              </div>
              <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">진행중</p>
                <p className="text-3xl font-bold text-blue-500">{stats.inProgress}</p>
              </div>
              <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">완료</p>
                <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                필터
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                    상태
                  </label>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-800 dark:text-white"
                  >
                    <option value="">모두</option>
                    <option value="pending">대기</option>
                    <option value="in-progress">진행중</option>
                    <option value="completed">완료</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                    우선순위
                  </label>
                  <select
                    value={priorityFilter}
                    onChange={e => setPriorityFilter(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-800 dark:text-white"
                  >
                    <option value="">모두</option>
                    <option value="low">낮음</option>
                    <option value="medium">중간</option>
                    <option value="high">높음</option>
                    <option value="urgent">긴급</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Task List */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                업무 목록 ({filtered.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">
                    일치하는 업무가 없습니다.
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
