'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/types/index';
import * as apiClient from '@/lib/api-client';

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: Error | null;
  getProjectById: (id: string) => Promise<Project>;
  refetch: () => Promise<void>;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const data = await apiClient.getProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }

  async function getProjectById(id: string): Promise<Project> {
    try {
      return await apiClient.getProject(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  }

  return {
    projects,
    loading,
    error,
    getProjectById,
    refetch: fetchProjects,
  };
}
