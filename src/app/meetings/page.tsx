'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/common/Badge';
import { useMeetings } from '@/hooks/useMeetings';
import { formatDate } from '@/lib/format-utils';

export default function MeetingsPage() {
  const { meetings, loading } = useMeetings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const stats = {
    total: meetings.length,
    weekly: meetings.filter(m => m.type === 'weekly').length,
    monthly: meetings.filter(m => m.type === 'monthly').length,
    actionItems: meetings.reduce((sum, m) => sum + m.actionItems.length, 0),
  };

  return (
    <main className="min-h-screen p-8">
      <ThemeToggle />

      <div className="max-w-6xl mx-auto">
        <Header
          title="📋 회의 기록"
          subtitle="회의 내용 및 액션 아이템 관리"
        />
        <Navigation />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">전체</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stats.total}
                </p>
              </div>
              <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">주간</p>
                <p className="text-3xl font-bold text-blue-500">{stats.weekly}</p>
              </div>
              <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">월간</p>
                <p className="text-3xl font-bold text-green-500">{stats.monthly}</p>
              </div>
              <div className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">액션</p>
                <p className="text-3xl font-bold text-purple-500">
                  {stats.actionItems}
                </p>
              </div>
            </div>

            {/* Meetings List */}
            <div className="space-y-6">
              {meetings.map(meeting => (
                <div
                  key={meeting.id}
                  className="bg-white/95 dark:bg-slate-800/70 border border-white/40 dark:border-white/10 backdrop-blur-md rounded-xl p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        {meeting.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {formatDate(meeting.date)}
                      </p>
                    </div>
                    <Badge variant="info">{meeting.type}</Badge>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {meeting.summary}
                  </p>

                  {/* Attendees */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      참석자 ({meeting.attendees.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {meeting.attendees.map((attendee, idx) => (
                        <Badge key={idx} variant="success">
                          {attendee}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Items */}
                  {meeting.actionItems.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        액션 아이템
                      </h4>
                      <div className="space-y-2">
                        {meeting.actionItems.map(item => (
                          <div
                            key={item.id}
                            className="bg-gray-100 dark:bg-slate-700 rounded-lg p-3"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-gray-800 dark:text-white text-sm font-medium">
                                  {item.description}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                  담당: {item.owner}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  item.status === 'completed'
                                    ? 'success'
                                    : 'warning'
                                }
                              >
                                {item.status === 'completed'
                                  ? '완료'
                                  : '진행중'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
