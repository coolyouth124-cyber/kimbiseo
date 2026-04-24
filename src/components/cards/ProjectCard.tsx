'use client';

import { Project } from '@/types/index';
import { formatPercent, formatCurrency } from '@/lib/format-utils';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-4">
      <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
        {project.title}
      </h3>

      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600 dark:text-gray-300">진행률</span>
          <span className="font-medium">{formatPercent(project.progress)}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-500 dark:text-gray-400">예산</p>
          <p className="font-medium text-gray-800 dark:text-white">
            {formatCurrency(project.budget)}
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">집행액</p>
          <p className="font-medium text-gray-800 dark:text-white">
            {formatCurrency(project.spent)}
          </p>
        </div>
      </div>
    </div>
  );
}
