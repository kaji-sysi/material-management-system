'use client';

import { useState } from 'react';
import GanttChart from '@/components/GanttChart';
import { mockProcesses, mockProductionOrders } from '@/lib/mockData';
import { Filter, Download } from 'lucide-react';

export default function GanttPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredProcesses = mockProcesses.filter(
    (process) => filterStatus === 'all' || process.status === filterStatus
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ガントチャート</h1>
        <p className="text-gray-600 mt-2">工程スケジュールをタイムライン表示</p>
      </div>

      {/* フィルターと操作 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <span className="text-sm font-medium">フィルター:</span>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全て</option>
              <option value="未着手">未着手</option>
              <option value="進行中">進行中</option>
              <option value="完了">完了</option>
              <option value="遅延">遅延</option>
              <option value="保留">保留</option>
            </select>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={18} />
            <span className="text-sm">エクスポート</span>
          </button>
        </div>
      </div>

      {/* ガントチャート */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <GanttChart processes={filteredProcesses} />
      </div>

      {/* 生産オーダー情報 */}
      <div className="mt-8 bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">生産オーダー一覧</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  オーダー番号
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  製品名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  数量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  顧客
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  進捗
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  納期
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockProductionOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === '進行中'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === '遅延'
                          ? 'bg-red-100 text-red-800'
                          : order.status === '完了'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{order.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.dueDate).toLocaleDateString('ja-JP')}
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
