'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '@/types';
import { mockTasks, mockWorkers } from '@/lib/mockData';
import { Plus } from 'lucide-react';
import KanbanColumn from '@/components/KanbanColumn';
import TaskCard from '@/components/TaskCard';

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: '待機', title: '待機', color: 'gray' },
  { id: '進行中', title: '進行中', color: 'blue' },
  { id: '承認待ち', title: '承認待ち', color: 'yellow' },
  { id: '完了', title: '完了', color: 'green' },
];

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeTask = tasks.find((t) => t.id === active.id);
    const overColumn = over.id as TaskStatus;

    if (activeTask && COLUMNS.find((col) => col.id === overColumn)) {
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === activeTask.id ? { ...task, status: overColumn } : task
        )
      );
    }

    setActiveTask(null);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const getWorkerName = (workerId?: string) => {
    if (!workerId) return '未割り当て';
    const worker = mockWorkers.find((w) => w.id === workerId);
    return worker?.name || workerId;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">カンバンボード</h1>
        <p className="text-gray-600 mt-2">タスクの進捗を可視化して管理</p>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {COLUMNS.map((column) => {
          const count = getTasksByStatus(column.id).length;
          return (
            <div key={column.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{column.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    column.color === 'gray'
                      ? 'bg-gray-100'
                      : column.color === 'blue'
                      ? 'bg-blue-100'
                      : column.color === 'yellow'
                      ? 'bg-yellow-100'
                      : 'bg-green-100'
                  }`}
                >
                  <span
                    className={`text-lg font-bold ${
                      column.color === 'gray'
                        ? 'text-gray-600'
                        : column.color === 'blue'
                        ? 'text-blue-600'
                        : column.color === 'yellow'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {count}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* カンバンボード */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {COLUMNS.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                color={column.color}
                count={columnTasks.length}
              >
                <SortableContext items={columnTasks.map((t) => t.id)}>
                  <div className="space-y-3">
                    {columnTasks.map((task) => (
                      <TaskCard key={task.id} task={task} getWorkerName={getWorkerName} />
                    ))}
                  </div>
                </SortableContext>

                {/* 新規タスク追加ボタン */}
                <button className="w-full mt-3 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2">
                  <Plus size={18} />
                  <span className="text-sm">タスクを追加</span>
                </button>
              </KanbanColumn>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} getWorkerName={getWorkerName} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
