export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
} as const;

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const PROJECT_STATUS = {
  PLANNING: 'planning',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  ON_HOLD: 'on-hold',
} as const;

export const MEETING_TYPE = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  AD_HOC: 'ad-hoc',
} as const;

export const STATUS_COLORS = {
  pending: '#FFA500',
  'in-progress': '#4CAF50',
  completed: '#4CAF50',
  'on-hold': '#FF6B6B',
  planning: '#808080',
} as const;

export const PRIORITY_COLORS = {
  low: '#4CAF50',
  medium: '#FFA500',
  high: '#FF6B6B',
  urgent: '#D32F2F',
} as const;

export const PRIORITY_LABELS = {
  low: '낮음',
  medium: '중간',
  high: '높음',
  urgent: '긴급',
} as const;

export const STATUS_LABELS = {
  pending: '대기',
  'in-progress': '진행 중',
  completed: '완료',
  'on-hold': '보류',
  planning: '계획 중',
} as const;
