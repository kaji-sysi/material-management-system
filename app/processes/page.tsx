'use client';

import { useState } from 'react';
import { mockProcesses, mockWorkers, mockEquipment } from '@/lib/mockData';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export default function ProcessesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProcesses = mockProcesses.filter((process) =>
    process.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWorkerNames = (workerIds: string[]) => {
    return workerIds
      .map((id) => mockWorkers.find((w) => w.id === id)?.name || id)
      .join(', ');
  };

  const getEquipmentNames = (equipmentIds: string[]) => {
    return equipmentIds
      .map((id) => mockEquipment.find((e) => e.id === id)?.name || id)
      .join(', ');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">工程管理</h1>
        <p className="text-gray-600 mt-2">製造工程の登録・編集・削除</p>
      </div>

      {/* 検索とアクション */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="工程名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={18} />
            <span>新規工程</span>
          </button>
        </div>
      </div>

      {/* 工程一覧テーブル */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  工程名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  進捗
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  優先度
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  担当者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  使用設備
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  期間
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProcesses.map((process) => (
                <tr key={process.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{process.name}</div>
                      <div className="text-sm text-gray-500">{process.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        process.status === '進行中'
                          ? 'bg-blue-100 text-blue-800'
                          : process.status === '完了'
                          ? 'bg-green-100 text-green-800'
                          : process.status === '遅延'
                          ? 'bg-red-100 text-red-800'
                          : process.status === '保留'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {process.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${process.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{process.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        process.priority === '緊急'
                          ? 'bg-red-100 text-red-800'
                          : process.priority === '高'
                          ? 'bg-orange-100 text-orange-800'
                          : process.priority === '中'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {process.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {getWorkerNames(process.assignedWorkers) || '未割り当て'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {getEquipmentNames(process.equipmentIds) || 'なし'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      {new Date(process.startDate).toLocaleDateString('ja-JP')}
                    </div>
                    <div className="text-xs text-gray-400">
                      〜 {new Date(process.endDate).toLocaleDateString('ja-JP')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
