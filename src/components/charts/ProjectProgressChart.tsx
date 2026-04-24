'use client';

import { Project } from '@/types/index';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ProjectProgressChartProps {
  projects: Project[];
}

export function ProjectProgressChart({ projects }: ProjectProgressChartProps) {
  const data = projects.map(p => ({
    name: p.title.slice(0, 12),
    progress: p.progress,
    budget: Math.round(p.budget / 100),
  }));

  return (
    <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
        🎯 프로젝트 진행률
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
          <YAxis stroke="rgba(255,255,255,0.5)" />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend />
          <Bar dataKey="progress" fill="#4CAF50" name="진행률 (%)" />
          <Bar dataKey="budget" fill="#2196F3" name="예산 (만원)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
