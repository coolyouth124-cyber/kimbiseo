'use client';

import { Task } from '@/types/index';
import { getPriorityColor, getStatusLabel, formatDate } from '@/lib/format-utils';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-800 dark:text-white flex-1 pr-2">
          {task.title}
        </h3>
        <span
          className="text-xs font-medium px-2 py-1 rounded-full text-white"
          style={{ backgroundColor: getPriorityColor(task.priority) }}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {task.description}
        </p>
      )}

      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>{getStatusLabel(task.status)}</span>
        <span>{formatDate(task.dueDate)}</span>
      </div>
    </div>
  );
}
