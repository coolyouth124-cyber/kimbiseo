export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type MeetingType = 'weekly' | 'monthly' | 'ad-hoc';
export type ProjectStatus = 'planning' | 'in-progress' | 'completed' | 'on-hold';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  parentId?: string;
  category?: string;
}

export interface ActionItem {
  id: string;
  description: string;
  owner: string;
  dueDate: string;
  status: TaskStatus;
  relatedMeeting: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  nextDate?: string;
  attendees: string[];
  type: MeetingType;
  summary: string;
  actionItems: ActionItem[];
  highlights: string[];
  decisions?: string[];
}

export interface Project {
  id: string;
  title: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  endDate: string;
  team: string[];
  budget: number;
  spent: number;
  description?: string;
}

export interface DashboardStats {
  totalMeetings: number;
  activeTasks: number;
  inProgressProjects: number;
  completedTasks: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
