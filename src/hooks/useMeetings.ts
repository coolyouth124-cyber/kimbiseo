'use client';

import { useState, useEffect } from 'react';
import { Meeting } from '@/types/index';
import * as apiClient from '@/lib/api-client';

interface UseMeetingsReturn {
  meetings: Meeting[];
  loading: boolean;
  error: Error | null;
  getMeetingById: (id: string) => Promise<Meeting>;
  refetch: () => Promise<void>;
}

export function useMeetings(): UseMeetingsReturn {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchMeetings();
  }, []);

  async function fetchMeetings() {
    try {
      setLoading(true);
      const data = await apiClient.getMeetings();
      setMeetings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }

  async function getMeetingById(id: string): Promise<Meeting> {
    try {
      return await apiClient.getMeeting(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    }
  }

  return {
    meetings,
    loading,
    error,
    getMeetingById,
    refetch: fetchMeetings,
  };
}
