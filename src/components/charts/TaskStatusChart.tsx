'use client';

import { Task } from '@/types/index';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface TaskStatusChartProps {
  tasks: Task[];
}

const COLORS = {
  'pending': '#FFA500',
  'in-progress': '#4CAF50',
  'completed': '#2196F3',
};

export function TaskStatusChart({ tasks }: TaskStatusChartProps) {
  const data = [
    {
      name: '대기',
      value: tasks.filter(t => t.status === 'pending').length,
      color: COLORS['pending'],
    },
    {
      name: '진행중',
      value: tasks.filter(t => t.status === 'in-progress').length,
      color: COLORS['in-progress'],
    },
    {
      name: '완료',
      value: tasks.filter(t => t.status === 'completed').length,
      color: COLORS['completed'],
    },
  ].filter(d => d.value > 0);

  return (
    <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
        📊 업무 상태 분포
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
