'use client';

import { Task } from '@/types/index';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PriorityDistributionChartProps {
  tasks: Task[];
}

export function PriorityDistributionChart({ tasks }: PriorityDistributionChartProps) {
  const data = [
    {
      priority: '낮음',
      count: tasks.filter(t => t.priority === 'low').length,
      completed: tasks.filter(t => t.priority === 'low' && t.status === 'completed').length,
    },
    {
      priority: '중간',
      count: tasks.filter(t => t.priority === 'medium').length,
      completed: tasks.filter(t => t.priority === 'medium' && t.status === 'completed').length,
    },
    {
      priority: '높음',
      count: tasks.filter(t => t.priority === 'high').length,
      completed: tasks.filter(t => t.priority === 'high' && t.status === 'completed').length,
    },
    {
      priority: '긴급',
      count: tasks.filter(t => t.priority === 'urgent').length,
      completed: tasks.filter(t => t.priority === 'urgent' && t.status === 'completed').length,
    },
  ];

  return (
    <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
        ⚡ 우선순위별 현황
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="priority" stroke="rgba(255,255,255,0.5)" />
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
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#FF6B6B" 
            strokeWidth={2}
            name="전체"
            dot={{ fill: '#FF6B6B' }}
          />
          <Line 
            type="monotone" 
            dataKey="completed" 
            stroke="#4CAF50" 
            strokeWidth={2}
            name="완료됨"
            dot={{ fill: '#4CAF50' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
