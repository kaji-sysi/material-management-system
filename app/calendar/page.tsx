'use client';

import { useState, useMemo } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { mockCalendarEvents } from '@/lib/mockData';
import { CalendarEvent } from '@/types';
import { Settings, Wrench, Users, Calendar as CalendarIcon, AlertCircle, CheckCircle } from 'lucide-react';

const locales = {
  'ja': ja,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarPage() {
  const [view, setView] = useState<View>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // イベントを BigCalendar のフォーマットに変換
  const events = useMemo(() => {
    return mockCalendarEvents.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }));
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'process':
        return Settings;
      case 'maintenance':
        return Wrench;
      case 'meeting':
        return Users;
      case 'deadline':
        return AlertCircle;
      case 'inspection':
        return CheckCircle;
      default:
        return CalendarIcon;
    }
  };

  const getEventStyle = (event: CalendarEvent) => {
    const styles: { [key: string]: React.CSSProperties } = {
      process: {
        backgroundColor: '#3b82f6',
        borderLeft: '4px solid #1d4ed8',
      },
      maintenance: {
        backgroundColor: '#f59e0b',
        borderLeft: '4px solid #d97706',
      },
      meeting: {
        backgroundColor: '#8b5cf6',
        borderLeft: '4px solid #6d28d9',
      },
      deadline: {
        backgroundColor: '#ef4444',
        borderLeft: '4px solid #dc2626',
      },
      inspection: {
        backgroundColor: '#10b981',
        borderLeft: '4px solid #059669',
      },
    };

    return {
      style: styles[event.type] || styles.process,
    };
  };

  const eventTypeLabels = [
    { type: 'process', label: '工程', color: 'bg-blue-500', icon: Settings },
    { type: 'maintenance', label: '保全', color: 'bg-yellow-500', icon: Wrench },
    { type: 'meeting', label: '会議', color: 'bg-purple-500', icon: Users },
    { type: 'deadline', label: '納期', color: 'bg-red-500', icon: AlertCircle },
    { type: 'inspection', label: '検査', color: 'bg-green-500', icon: CheckCircle },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">カレンダー</h1>
        <p className="text-gray-600 mt-2">工程、保全、会議などのスケジュールを確認</p>
      </div>

      {/* イベント種別の凡例 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold text-gray-700">イベント種別:</span>
          {eventTypeLabels.map(({ type, label, color, icon: Icon }) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`w-4 h-4 ${color} rounded`}></div>
              <Icon size={16} className="text-gray-600" />
              <span className="text-sm text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* カレンダー */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200" style={{ height: '700px' }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          onSelectEvent={(event) => setSelectedEvent(event as CalendarEvent)}
          eventPropGetter={getEventStyle}
          culture="ja"
          messages={{
            next: '次へ',
            previous: '前へ',
            today: '今日',
            month: '月',
            week: '週',
            day: '日',
            agenda: '予定',
            date: '日付',
            time: '時間',
            event: 'イベント',
            noEventsInRange: 'この期間にイベントはありません',
            showMore: (total) => `+${total} 件`,
          }}
        />
      </div>

      {/* イベント詳細モーダル */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = getEventIcon(selectedEvent.type);
                  return <Icon size={24} className="text-gray-700" />;
                })()}
                <h3 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">種別:</span>
                <div className="mt-1">
                  <span
                    className={`inline-block px-3 py-1 rounded text-white text-sm ${
                      selectedEvent.type === 'process'
                        ? 'bg-blue-500'
                        : selectedEvent.type === 'maintenance'
                        ? 'bg-yellow-500'
                        : selectedEvent.type === 'meeting'
                        ? 'bg-purple-500'
                        : selectedEvent.type === 'deadline'
                        ? 'bg-red-500'
                        : 'bg-green-500'
                    }`}
                  >
                    {eventTypeLabels.find((e) => e.type === selectedEvent.type)?.label}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-sm text-gray-600">開始:</span>
                <p className="text-gray-900">
                  {format(new Date(selectedEvent.start), 'yyyy年M月d日 HH:mm', { locale: ja })}
                </p>
              </div>

              <div>
                <span className="text-sm text-gray-600">終了:</span>
                <p className="text-gray-900">
                  {format(new Date(selectedEvent.end), 'yyyy年M月d日 HH:mm', { locale: ja })}
                </p>
              </div>

              {selectedEvent.description && (
                <div>
                  <span className="text-sm text-gray-600">説明:</span>
                  <p className="text-gray-900 mt-1">{selectedEvent.description}</p>
                </div>
              )}

              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600">参加者:</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedEvent.attendees.map((attendee, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                      >
                        {attendee}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                閉じる
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                編集
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
