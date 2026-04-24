'use client';

interface StatsCardProps {
  icon: string;
  label: string;
  value: number | string;
  color?: 'green' | 'blue' | 'purple' | 'orange';
}

const colorMap = {
  green: 'from-green-400 to-green-600',
  blue: 'from-blue-400 to-blue-600',
  purple: 'from-purple-400 to-purple-600',
  orange: 'from-orange-400 to-orange-600',
};

export function StatsCard({
  icon,
  label,
  value,
  color = 'green',
}: StatsCardProps) {
  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} rounded-xl p-6 text-white shadow-lg`}>
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-white/80 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
