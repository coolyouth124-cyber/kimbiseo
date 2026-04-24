'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '📊 대시보드' },
  { href: '/meetings', label: '📋 회의' },
  { href: '/tasks', label: '✅ 할일' },
  { href: '/projects', label: '🎯 프로젝트' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex gap-2 flex-wrap">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded-lg transition ${
              isActive
                ? 'bg-green-500 text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
