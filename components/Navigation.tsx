'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GanttChart,
  KanbanSquare,
  Calendar,
  Settings,
  Users,
  Package,
  CheckCircle,
  Wrench,
  BarChart3,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/gantt', label: 'ガントチャート', icon: GanttChart },
  { href: '/kanban', label: 'カンバン', icon: KanbanSquare },
  { href: '/calendar', label: 'カレンダー', icon: Calendar },
  { href: '/processes', label: '工程管理', icon: Settings },
  { href: '/workers', label: '作業者管理', icon: Users },
  { href: '/inventory', label: '在庫管理', icon: Package },
  { href: '/quality', label: '品質管理', icon: CheckCircle },
  { href: '/equipment', label: '設備管理', icon: Wrench },
  { href: '/reports', label: 'レポート', icon: BarChart3 },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 text-white w-64 min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">製造管理システム</h1>
        <p className="text-sm text-gray-400">Manufacturing MES</p>
      </div>

      <ul className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          <p>バージョン 1.0.0</p>
          <p className="mt-1">© 2024 Manufacturing MES</p>
        </div>
      </div>
    </nav>
  );
}
