'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
}

const variantStyles = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
};

export function Badge({ children, variant = 'info' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
