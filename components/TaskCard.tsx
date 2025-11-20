'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';
import { Calendar, User, Tag, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  getWorkerName: (workerId?: string) => string;
  isDragging?: boolean;
}

export default function TaskCard({ task, getWorkerName, isDragging = false }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '緊急':
        return 'bg-red-100 text-red-800';
      case '高':
        return 'bg-orange-100 text-orange-800';
      case '中':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const isPastDue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== '完了';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-move hover:shadow-md transition-shadow ${
        isPastDue ? 'border-l-4 border-l-red-500' : ''
      }`}
    >
      {/* タイトルと優先度 */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 text-sm flex-1">{task.title}</h4>
        <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      {/* 説明 */}
      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* タグ */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* 担当者 */}
      <div className="flex items-center text-xs text-gray-600 mb-2">
        <User size={14} className="mr-1" />
        <span>{getWorkerName(task.assignee)}</span>
      </div>

      {/* 期限 */}
      {task.dueDate && (
        <div className={`flex items-center text-xs ${isPastDue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
          {isPastDue && <AlertCircle size={14} className="mr-1" />}
          {!isPastDue && <Calendar size={14} className="mr-1" />}
          <span>{format(new Date(task.dueDate), 'yyyy/MM/dd', { locale: ja })}</span>
          {isPastDue && <span className="ml-1">(期限切れ)</span>}
        </div>
      )}
    </div>
  );
}
