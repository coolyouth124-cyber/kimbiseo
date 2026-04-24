'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { StatsCard } from '@/components/cards/StatsCard';
import { TaskCard } from '@/components/cards/TaskCard';
import { ProjectCard } from '@/components/cards/ProjectCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useMeetings } from '@/hooks/useMeetings';

export default function Home() {
  const { tasks, loading: tasksLoading } = useTasks();
  const { projects, loading: projectsLoading } = useProjects();
  const { meetings, loading: meetingsLoading } = useMeetings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const activeTasks = tasks.filter(t => t.status === 'in-progress').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const activeProjects = projects.filter(p => p.status === 'in-progress').length;

  const isLoading = tasksLoading || projectsLoading || meetingsLoading;

  return (
    <main className="min-h-screen p-8">
      <ThemeToggle />
      
      <div className="max-w-7xl mx-auto">
        <Header
          title="📊 마케팅팀 대시보드"
          subtitle="마케팅팀을 위한 통합 데이터 분석 및 업무 관리 플랫폼"
        />

        <Navigation />

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard
                icon="📋"
                label="전체 업무"
                value={tasks.length}
                color="blue"
              />
              <StatsCard
                icon="⚡"
                label="진행중인 업무"
                value={activeTasks}
                color="green"
              />
              <StatsCard
                icon="✅"
                label="완료된 업무"
                value={completedTasks}
                color="purple"
              />
              <StatsCard
                icon="🎯"
                label="활성 프로젝트"
                value={activeProjects}
                color="orange"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2">
                {/* Recent Tasks */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">⚡ 진행중인 업무</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tasks
                      .filter(t => t.status === 'in-progress')
                      .slice(0, 4)
                      .map(task => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                  </div>
                </div>

                {/* Projects Section */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">🎯 프로젝트 현황</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.slice(0, 4).map(project => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Recent Meetings */}
                <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-6">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                    📋 최근 회의
                  </h2>
                  <div className="space-y-4">
                    {meetings.slice(0, 3).map(meeting => (
                      <div
                        key={meeting.id}
                        className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                      >
                        <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
                          {meeting.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {meeting.attendees.length}명 참석
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                          {meeting.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
