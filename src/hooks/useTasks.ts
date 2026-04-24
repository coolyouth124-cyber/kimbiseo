'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types/index';
import * as apiClient from '@/lib/api-client';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: Error | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      const data = await apiClient.getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }

  async function addTask(task: Omit<Task, 'id' | 'createdAt'>) {
    try {
      const newTask = await apiClient.createTask(task);
      setTasks([...tasks, newTask]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  }

  async function updateTaskFn(id: string, task: Partial<Task>) {
    try {
      const updated = await apiClient.updateTask(id, task);
      setTasks(tasks.map(t => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  }

  async function deleteTaskFn(id: string) {
    try {
      await apiClient.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  }

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask: updateTaskFn,
    deleteTask: deleteTaskFn,
    refetch: fetchTasks,
  };
}
