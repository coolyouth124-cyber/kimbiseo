import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: '김비서 - 마케팅팀 대시보드',
  description: '마케팅팀을 위한 통합 데이터 분석 및 업무 관리 플랫폼',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 min-h-screen">
        {children}
      </body>
    </html>
  );
}
