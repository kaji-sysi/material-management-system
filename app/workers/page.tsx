'use client';

import { mockWorkers } from '@/lib/mockData';
import { Plus, Edit, Mail, Phone, Award } from 'lucide-react';

export default function WorkersPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">作業者管理</h1>
        <p className="text-gray-600 mt-2">作業者の情報とスキル管理</p>
      </div>

      {/* アクションバー */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">全作業者: {mockWorkers.length}名</span>
            <span className="text-sm text-green-600 font-medium">
              稼働中: {mockWorkers.filter(w => w.availability === 'busy').length}名
            </span>
            <span className="text-sm text-gray-600">
              待機中: {mockWorkers.filter(w => w.availability === 'available').length}名
            </span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={18} />
            <span>新規作業者</span>
          </button>
        </div>
      </div>

      {/* 作業者カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockWorkers.map((worker) => (
          <div key={worker.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">
                    {worker.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{worker.name}</h3>
                  <p className="text-sm text-gray-500">{worker.employeeNumber}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  worker.availability === 'available'
                    ? 'bg-green-100 text-green-800'
                    : worker.availability === 'busy'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {worker.availability === 'available'
                  ? '待機中'
                  : worker.availability === 'busy'
                  ? '稼働中'
                  : 'オフライン'}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail size={16} className="mr-2" />
                <span>{worker.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone size={16} className="mr-2" />
                <span>{worker.phone}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">所属部署</p>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                  {worker.department}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">スキル</p>
              <div className="flex flex-wrap gap-1">
                {worker.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Award size={16} />
                資格
              </p>
              <div className="space-y-1">
                {worker.certifications.map((cert, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    • {cert}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">
                現在のタスク: {worker.currentTasks.length}件
              </p>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1">
                <Edit size={14} />
                編集
              </button>
              <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                詳細
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
