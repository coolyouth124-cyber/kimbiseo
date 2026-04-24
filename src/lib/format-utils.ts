import { PRIORITY_LABELS, STATUS_LABELS, PRIORITY_COLORS, STATUS_COLORS } from '@/data/constants';
import type { Priority, TaskStatus } from '@/types/index';

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function getPriorityLabel(priority: Priority): string {
  return PRIORITY_LABELS[priority] || priority;
}

export function getStatusLabel(status: TaskStatus): string {
  return STATUS_LABELS[status] || status;
}

export function getPriorityColor(priority: Priority): string {
  return PRIORITY_COLORS[priority] || '#999';
}

export function getStatusColor(status: TaskStatus): string {
  return STATUS_COLORS[status] || '#999';
}

export function getDaysUntilDue(dueDate: string): number {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isOverdue(dueDate: string): boolean {
  return getDaysUntilDue(dueDate) < 0;
}

export function isDueSoon(dueDate: string): boolean {
  const days = getDaysUntilDue(dueDate);
  return days >= 0 && days <= 3;
}
