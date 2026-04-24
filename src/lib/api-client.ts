import { Task, Meeting, Project, User } from '@/types/index';

// Task API
export async function getTasks(): Promise<Task[]> {
  const response = await fetch('/api/tasks');
  if (!response.ok) throw new Error('Failed to fetch tasks');
  const data = await response.json();
  return data.data;
}

export async function getTask(id: string): Promise<Task> {
  const response = await fetch(`/api/tasks/${id}`);
  if (!response.ok) throw new Error('Failed to fetch task');
  const data = await response.json();
  return data.data;
}

export async function createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error('Failed to create task');
  const data = await response.json();
  return data.data;
}

export async function updateTask(id: string, task: Partial<Task>): Promise<Task> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error('Failed to update task');
  const data = await response.json();
  return data.data;
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete task');
}

// Meeting API
export async function getMeetings(): Promise<Meeting[]> {
  const response = await fetch('/api/meetings');
  if (!response.ok) throw new Error('Failed to fetch meetings');
  const data = await response.json();
  return data.data;
}

export async function getMeeting(id: string): Promise<Meeting> {
  const response = await fetch(`/api/meetings/${id}`);
  if (!response.ok) throw new Error('Failed to fetch meeting');
  const data = await response.json();
  return data.data;
}

// Project API
export async function getProjects(): Promise<Project[]> {
  const response = await fetch('/api/projects');
  if (!response.ok) throw new Error('Failed to fetch projects');
  const data = await response.json();
  return data.data;
}

export async function getProject(id: string): Promise<Project> {
  const response = await fetch(`/api/projects/${id}`);
  if (!response.ok) throw new Error('Failed to fetch project');
  const data = await response.json();
  return data.data;
}

// User API
export async function getUsers(): Promise<User[]> {
  const response = await fetch('/api/users');
  if (!response.ok) throw new Error('Failed to fetch users');
  const data = await response.json();
  return data.data;
}
