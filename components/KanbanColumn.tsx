'use client';

import { useDroppable } from '@dnd-kit/core';
import { ReactNode } from 'react';

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  count: number;
  children: ReactNode;
}

export default function KanbanColumn({ id, title, color, count, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const getBorderColor = () => {
    switch (color) {
      case 'blue':
        return 'border-blue-400';
      case 'yellow':
        return 'border-yellow-400';
      case 'green':
        return 'border-green-400';
      default:
        return 'border-gray-400';
    }
  };

  const getBackgroundColor = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50';
      case 'yellow':
        return 'bg-yellow-50';
      case 'green':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  };

  const getTextColor = () => {
    switch (color) {
      case 'blue':
        return 'text-blue-700';
      case 'yellow':
        return 'text-yellow-700';
      case 'green':
        return 'text-green-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg border-2 transition-all ${
        isOver ? `${getBorderColor()} ${getBackgroundColor()}` : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className={`p-4 rounded-t-lg ${getBackgroundColor()} border-b-2 ${getBorderColor()}`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-bold text-lg ${getTextColor()}`}>{title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTextColor()} bg-white`}>
            {count}
          </span>
        </div>
      </div>
      <div className="p-4 min-h-[500px]">{children}</div>
    </div>
  );
}
