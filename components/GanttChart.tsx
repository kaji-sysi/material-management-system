'use client';

import { Process } from '@/types';
import { format, differenceInDays } from 'date-fns';
import { ja } from 'date-fns/locale';

interface GanttChartProps {
  processes: Process[];
}

export default function GanttChart({ processes }: GanttChartProps) {
  // 全工程の開始日と終了日から期間を算出
  const allDates = processes.flatMap(p => [new Date(p.startDate), new Date(p.endDate)]);
  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
  const totalDays = differenceInDays(maxDate, minDate) + 1;

  // 月の区切りを表示するためのヘッダー
  const monthHeaders: { month: string; days: number; startDay: number }[] = [];
  let currentDate = new Date(minDate);
  let dayCounter = 0;

  while (currentDate <= maxDate) {
    const month = format(currentDate, 'yyyy年M月', { locale: ja });
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const remainingDays = Math.min(
      daysInMonth - currentDate.getDate() + 1,
      differenceInDays(maxDate, currentDate) + 1
    );

    monthHeaders.push({
      month,
      days: remainingDays,
      startDay: dayCounter,
    });

    dayCounter += remainingDays;
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
  }

  // ステータスに応じた色を返す
  const getStatusColor = (status: string) => {
    switch (status) {
      case '進行中':
        return 'bg-blue-500';
      case '完了':
        return 'bg-green-500';
      case '遅延':
        return 'bg-red-500';
      case '保留':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1200px]">
        {/* 月ヘッダー */}
        <div className="flex border-b-2 border-gray-300">
          <div className="w-64 flex-shrink-0 bg-gray-100 p-4 font-bold border-r-2">
            工程名
          </div>
          <div className="flex-1 flex">
            {monthHeaders.map((header, index) => (
              <div
                key={index}
                className="bg-gray-100 p-2 text-center border-r font-semibold text-sm"
                style={{ width: `${(header.days / totalDays) * 100}%` }}
              >
                {header.month}
              </div>
            ))}
          </div>
        </div>

        {/* 日付ヘッダー */}
        <div className="flex border-b border-gray-300">
          <div className="w-64 flex-shrink-0 bg-gray-50 p-2 border-r-2"></div>
          <div className="flex-1 flex">
            {Array.from({ length: totalDays }, (_, i) => {
              const date = new Date(minDate);
              date.setDate(date.getDate() + i);
              const day = date.getDate();
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;

              return (
                <div
                  key={i}
                  className={`text-xs text-center p-1 border-r ${
                    isWeekend ? 'bg-red-50 text-red-600' : 'bg-gray-50'
                  }`}
                  style={{ width: `${(1 / totalDays) * 100}%` }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* ガントバー */}
        {processes.map((process) => {
          const startDay = differenceInDays(new Date(process.startDate), minDate);
          const duration = differenceInDays(
            new Date(process.endDate),
            new Date(process.startDate)
          ) + 1;
          const leftPercentage = (startDay / totalDays) * 100;
          const widthPercentage = (duration / totalDays) * 100;

          return (
            <div key={process.id} className="flex border-b border-gray-200 hover:bg-gray-50">
              <div className="w-64 flex-shrink-0 p-3 border-r-2">
                <div className="font-medium text-sm">{process.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-white ${getStatusColor(
                      process.status
                    )}`}
                  >
                    {process.status}
                  </span>
                  <span className="ml-2">{process.progress}%</span>
                </div>
              </div>
              <div className="flex-1 relative py-3">
                <div
                  className="absolute h-8 rounded flex items-center px-2 shadow-sm"
                  style={{
                    left: `${leftPercentage}%`,
                    width: `${widthPercentage}%`,
                  }}
                >
                  {/* バックグラウンドバー */}
                  <div className={`absolute inset-0 ${getStatusColor(process.status)} opacity-80 rounded`}></div>
                  {/* 進捗バー */}
                  <div
                    className={`absolute inset-0 ${getStatusColor(process.status)} rounded`}
                    style={{ width: `${process.progress}%` }}
                  ></div>
                  {/* 残りの部分（薄い色） */}
                  <div
                    className="absolute inset-0 bg-gray-300 opacity-40 rounded"
                    style={{ left: `${process.progress}%`, width: `${100 - process.progress}%` }}
                  ></div>
                  {/* テキスト */}
                  <span className="relative text-xs text-white font-medium z-10 truncate">
                    {process.name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="mt-6 flex items-center gap-6 text-sm">
        <span className="font-semibold">ステータス:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span>未着手</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>進行中</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>完了</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>遅延</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>保留</span>
        </div>
      </div>
    </div>
  );
}
